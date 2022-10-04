import { CollaborationsHandler } from "./handler.js";
import { routes } from "./routes.js";

/**
 * @typedef {object} CollaborationsPluginOptions
 * @property {import("../../services/postgres/collaborations-service.js").CollaborationsService} collaborationsService
 * @property {import("../../services/postgres/notes-service.js").NotesService} notesService
 * @property {import("../../validator/collaborations/index.js").CollaborationsValidator} validator
 */

/** @type {import("@hapi/hapi").Plugin<CollaborationsPluginOptions>} */
export const collaborationsPlugin = {
	name: "collaborations",
	version: "1.0.0",
	async register(server, { collaborationsService, notesService, validator }) {
		const handler = new CollaborationsHandler(collaborationsService, notesService, validator);

		server.route(routes(handler));
	},
};
