import { default as Hapi } from "@hapi/hapi";

import { notesPlugin } from "./api/notes/index.js";
import { NotesService } from "./services/in-memory/notes-service.js";
import { NoteValidator } from "./validator/notes/index.js";

const init = async () => {
	const server = Hapi.server({
		port: 5000,
		host: process.env.NODE_ENV === "production" ? "0.0.0.0" : "localhost",
		routes: {
			cors: {
				origin: ["*"],
			},
		},
	});
	const notesService = new NotesService();

	await server.register({
		plugin: notesPlugin,
		options: {
			service: notesService,
			validator: NoteValidator,
		},
	});

	await server.start();
	console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
