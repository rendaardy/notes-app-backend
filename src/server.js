import process from "node:process";
import { default as Hapi } from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import Inert from "@hapi/inert";
import * as dotenv from "dotenv";
import pinoPlugin from "hapi-pino";

import { notesPlugin } from "./api/notes/index.js";
import { NotesService } from "./services/postgres/notes-service.js";
import { NoteValidator } from "./validator/notes/index.js";
import { usersPlugin } from "./api/users/index.js";
import { UsersService } from "./services/postgres/users-service.js";
import { UsersValidator } from "./validator/users/index.js";
import { collaborationsPlugin } from "./api/collaborations/index.js";
import { CollaborationsService } from "./services/postgres/collaborations-service.js";
import { CollaborationsValidator } from "./validator/collaborations/index.js";
import { authenticationsPlugin } from "./api/authentications/index.js";
import { AuthenticationsService } from "./services/postgres/authentications-service.js";
import { AuthenticationsValidator } from "./validator/authentications/index.js";
import { TokenManager } from "./tokenize/token-manager.js";
import { exportsPlugin } from "./api/exports/index.js";
import { ProducerService } from "./services/rabbitmq/producer-service.js";
import { ExportsValidator } from "./validator/exports/index.js";
import { uploadsPlugin } from "./api/uploads/index.js";
import { StorageService } from "./services/s3/storage-service.js";
import { UploadsValidator } from "./validator/uploads/index.js";
import { CacheService } from "./services/redis/cache-service.js";

dotenv.config();

const init = async () => {
	const server = Hapi.server({
		port: process.env.PORT,
		host: process.env.HOST,
		routes: {
			cors: {
				origin: ["*"],
			},
		},
		debug: false,
	});
	const cacheService = new CacheService();
	const collaborationsService = new CollaborationsService(cacheService);
	const notesService = new NotesService(collaborationsService, cacheService);
	const usersService = new UsersService();
	const authenticationsService = new AuthenticationsService();
	const storageService = new StorageService();

	await server.register({
		plugin: pinoPlugin,
		options: {
			redact: ["req.headers.authorization"],
		},
	});
	await server.register([Jwt.plugin, Inert]);

	server.auth.strategy("notesapp_jwt", "jwt", {
		keys: process.env.ACCESS_TOKEN_KEY,
		verify: {
			aud: false,
			iss: false,
			sub: false,
			maxAgeSec: process.env.ACCESS_TOKEN_AGE,
		},
		/**
		 * @param {any} artifacts
		 */
		validate(artifacts) {
			return {
				isValid: true,
				credentials: {
					id: artifacts.decoded.payload.id,
				},
			};
		},
	});

	await server.register([
		{
			plugin: notesPlugin,
			options: {
				service: notesService,
				validator: NoteValidator,
			},
		},
		{
			plugin: usersPlugin,
			options: {
				service: usersService,
				validator: UsersValidator,
			},
		},
		{
			plugin: authenticationsPlugin,
			options: {
				authenticationsService,
				usersService,
				tokenManager: TokenManager,
				validator: AuthenticationsValidator,
			},
		},
		{
			plugin: collaborationsPlugin,
			options: {
				collaborationsService,
				notesService,
				validator: CollaborationsValidator,
			},
		},
		{
			plugin: exportsPlugin,
			options: {
				service: ProducerService,
				validator: ExportsValidator,
			},
		},
		{
			plugin: uploadsPlugin,
			options: {
				service: storageService,
				validator: UploadsValidator,
			},
		},
	]);

	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
