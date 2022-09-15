import { NotesHandler } from "./handler.js";
import { routes } from "./routes.js";

/**
 * @typedef {Object} NotesPluginOptions
 * @property {import("../../services/postgres/notes-service.js").NotesService} service
 * @property {import("../../validator/notes/index.js").NoteValidator} validator
 */

/** @type {import("@hapi/hapi").Plugin<NotesPluginOptions>} */
export const notesPlugin = {
	name: "notes",
	version: "1.0.0",
	async register(server, options) {
		const { service, validator } = options;
		const notesHandler = new NotesHandler(service, validator);

		server.route(routes(notesHandler));
	},
};
