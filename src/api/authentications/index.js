import { AuthenticationsHandler } from "./handler.js";
import { routes } from "./routes.js";

/**
 * @typedef {object} AuthenticationsPluginOptions
 * @property {import("../../services/postgres/authentications-service.js").AuthenticationsService} authenticationsService
 * @property {import("../../services/postgres/users-service.js").UsersService} usersService
 * @property {import("../../tokenize/token-manager.js").TokenManager} tokenManager
 * @property {import("../../validator/authentications/index.js").AuthenticationsValidator} validator
 */

/** @type {import("@hapi/hapi").Plugin<AuthenticationsPluginOptions>} */
export const authenticationsPlugin = {
	name: "authentications",
	version: "1.0.0",
	async register(server, { authenticationsService, usersService, tokenManager, validator }) {
		const handler = new AuthenticationsHandler(
			authenticationsService,
			usersService,
			tokenManager,
			validator,
		);

		server.route(routes(handler));
	},
};
