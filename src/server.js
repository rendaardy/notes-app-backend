import process from "node:process";
import { default as Hapi } from "@hapi/hapi";
import Jwt from "@hapi/jwt";
import * as dotenv from "dotenv";

import { notesPlugin } from "./api/notes/index.js";
import { NotesService } from "./services/postgres/notes-service.js";
import { NoteValidator } from "./validator/notes/index.js";
import { usersPlugin } from "./api/users/index.js";
import { UsersService } from "./services/postgres/users-service.js";
import { UsersValidator } from "./validator/users/index.js";
import { authenticationsPlugin } from "./api/authentications/index.js";
import { AuthenticationsService } from "./services/postgres/authentications-service.js";
import { AuthenticationsValidator } from "./validator/authentications/index.js";
import { TokenManager } from "./tokenize/token-manager.js";

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
	});
	const notesService = new NotesService();
	const usersService = new UsersService();
	const authenticationsService = new AuthenticationsService();

	await server.register([Jwt]);

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
	]);

	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
