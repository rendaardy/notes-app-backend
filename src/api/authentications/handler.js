import { ClientError } from "../../exceptions/client-error.js";

/**
 * @typedef {object} UserCredentialPayload
 * @property {string} username
 * @property {string} password
 */

/**
 * @typedef {object} TokenPayload
 * @property {string} refreshToken
 */

export class AuthenticationsHandler {
	/**
	 * @param {import("../../services/postgres/authentications-service.js").AuthenticationsService} authenticationsService
	 * @param {import("../../services/postgres/users-service.js").UsersService} usersService
	 * @param {import("../../tokenize/token-manager.js").TokenManager} tokenManager
	 * @param {import("../../validator/authentications/index.js").AuthenticationsValidator} validator
	 */
	constructor(authenticationsService, usersService, tokenManager, validator) {
		/**
		 * @private
		 */
		this._authenticationsService = authenticationsService;

		/**
		 * @private
		 */
		this._usersService = usersService;

		/**
		 * @private
		 */
		this._tokenManager = tokenManager;

		/**
		 * @private
		 */
		this._validator = validator;

		this.postAuthenticationHandler = this.postAuthenticationHandler.bind(this);
		this.putAuthenticationHandler = this.putAuthenticationHandler.bind(this);
		this.deleteAuthenticationHandler = this.deleteAuthenticationHandler.bind(this);
	}

	/**
	 * @param {import("@hapi/hapi").Request} request
	 * @param {import("@hapi/hapi").ResponseToolkit} h
	 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
	 */
	async postAuthenticationHandler(request, h) {
		try {
			this._validator.validatePostPayload(request.payload);

			const { username, password } = /** @type {UserCredentialPayload} */ (request.payload);
			const id = await this._usersService.verifyUserCredential(username, password);
			const accessToken = this._tokenManager.generateAccessToken({ id });
			const refreshToken = this._tokenManager.generateRefreshToken({ id });

			await this._authenticationsService.addRefreshToken(refreshToken);

			const response = h.response({
				status: "success",
				message: "Authentication berhasil ditambahkan",
				data: {
					accessToken,
					refreshToken,
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
				message: "Maaf, terjadi kegagalan pada server kami",
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
	async putAuthenticationHandler(request, h) {
		try {
			this._validator.validatePutPayload(request.payload);

			const { refreshToken } = /** @type {TokenPayload} */ (request.payload);

			await this._authenticationsService.verifyRefreshToken(refreshToken);

			const { id } = this._tokenManager.verifyRefreshToken(refreshToken);
			const accessToken = this._tokenManager.generateAccessToken({ id });

			return {
				status: "success",
				message: "Access Token berhasil diperbarui",
				data: {
					accessToken,
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

	/**
	 * @param {import("@hapi/hapi").Request} request
	 * @param {import("@hapi/hapi").ResponseToolkit} h
	 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
	 */
	async deleteAuthenticationHandler(request, h) {
		try {
			this._validator.validateDeletePayload(request.payload);

			const { refreshToken } = /** @type {TokenPayload} */ (request.payload);
			await this._authenticationsService.verifyRefreshToken(refreshToken);
			await this._authenticationsService.deleteRefreshToken(refreshToken);

			return {
				status: "success",
				message: "Refresh token berhasil dihapus",
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
