import { routes } from "./routes.js";
import { ExportsHandler } from "./handler.js";

/**
 * @typedef {object} ExportsPluginOptions
 * @property {import("../../services/rabbitmq/producer-service.js").ProducerService} service
 * @property {import("../../validator/exports/index.js").ExportsValidator} validator
 */

/** @type {import("@hapi/hapi").Plugin<ExportsPluginOptions>} */
export const exportsPlugin = {
	name: "exports",
	version: "1.0.0",
	async register(server, { service, validator }) {
		const handler = new ExportsHandler(service, validator);
		server.route(routes(handler));
	},
};
