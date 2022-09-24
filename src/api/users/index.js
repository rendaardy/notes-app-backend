import { UsersHandler } from "./handler.js";
import { routes } from "./routes.js";

/**
 * @typedef {object} UsersPluginOptions
 * @property {import("../../services/postgres/users-service.js").UsersService} service
 * @property {import("../../validator/users/index.js").UsersValidator} validator
 */

/** @type {import("@hapi/hapi").Plugin<UsersPluginOptions>} */
export const usersPlugin = {
	name: "users",
	version: "1.0.0",
	async register(server, { service, validator }) {
		const handler = new UsersHandler(service, validator);

		server.route(routes(handler));
	},
};
