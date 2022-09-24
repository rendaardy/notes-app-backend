import { default as Hapi } from "@hapi/hapi";
import * as dotenv from "dotenv";

import { notesPlugin } from "./api/notes/index.js";
import { NotesService } from "./services/postgres/notes-service.js";
import { NoteValidator } from "./validator/notes/index.js";
import { usersPlugin } from "./api/users/index.js";
import { UsersService } from "./services/postgres/users-service.js";
import { UsersValidator } from "./validator/users/index.js";

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
	]);

	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
