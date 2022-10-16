import { routes } from "./routes.js";
import { UploadsHandler } from "./handler.js";

/**
 * @typedef {object} UploadsPluginOptions
 * @property {import("../../services/storage/storage-service.js").StorageService} service
 * @property {import("../../validator/uploads/index.js").UploadsValidator} validator
 */

/** @type {import("@hapi/hapi").Plugin<UploadsPluginOptions>} */
export const uploadsPlugin = {
	name: "uploads",
	version: "1.0.0",
	async register(server, { service, validator }) {
		const handler = new UploadsHandler(service, validator);

		server.route(routes(handler));
	},
};
