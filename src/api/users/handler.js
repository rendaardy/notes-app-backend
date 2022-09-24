import { ClientError } from "../../exceptions/client-error.js";

/**
 * @typedef {object} Payload
 * @property {string} username
 * @property {string} password
 * @property {string} fullname
 */

export class UsersHandler {
	/**
	 * @param {import("../../services/postgres/users-service.js").UsersService} service
	 * @param {import("../../validator/users/index.js").UsersValidator} validator
	 */
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		this.postUserHandler = this.postUserHandler.bind(this);
		this.getUserByIdHandler = this.getUserByIdHandler.bind(this);
	}

	/**
	 * @param {import("@hapi/hapi").Request} request
	 * @param {import("@hapi/hapi").ResponseToolkit} h
	 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
	 */
	async postUserHandler(request, h) {
		try {
			this._validator.validatePayload(request.payload);

			const { username, password, fullname } = /** @type {Payload} */ (request.payload);
			const userId = await this._service.addUser({ username, password, fullname });

			const response = h.response({
				status: "success",
				message: "User berhasil ditambahkan",
				data: {
					userId,
				},
			});
			response.code(201);

			return response;
		} catch (error) {
			if (error instanceof ClientError) {
				const response = h.response({
					status: "fail",
					message: error.message,
				});
				response.code(error.statusCode);
				return response;
			}

			const response = h.response({
				status: "error",
				message: "Maaf, terjadi kegagalan pada server kami.",
			});
			response.code(500);
			console.error(error);
			return response;
		}
	}

	/**
	 * @param {import("@hapi/hapi").Request} request
	 * @param {import("@hapi/hapi").ResponseToolkit} h
	 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
	 */
	async getUserByIdHandler(request, h) {
		try {
			const { id } = request.params;
			const user = await this._service.getUserById(id);

			return {
				status: "success",
				data: {
					user,
				},
			};
		} catch (error) {
			if (error instanceof ClientError) {
				const response = h.response({
					status: "fail",
					message: error.message,
				});
				response.code(error.statusCode);
				return response;
			}

			const response = h.response({
				status: "error",
				message: "Maaf, terjadi kegagalan pada server kami",
			});
			response.code(500);
			console.error(error);
			return response;
		}
	}
}
