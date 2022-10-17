import { ClientError } from "../../exceptions/client-error.js";

export class UploadsHandler {
	/**
	 * @param {import("../../services/storage/storage-service.js").StorageService} service
	 * @param {import("../../validator/uploads/index.js").UploadsValidator} validator
	 */
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		this.postUploadImageHandler = this.postUploadImageHandler.bind(this);
	}

	/**
	 * @param {import("@hapi/hapi").Request} request
	 * @param {import("@hapi/hapi").ResponseToolkit} h
	 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
	 */
	async postUploadImageHandler(request, h) {
		try {
			const { data } = /** @type {{ data: import("node:stream").Readable }} */ (request.payload);

			// @ts-ignore
			this._validator.validateHeaders(data?.hapi?.headers);

			// @ts-ignore
			const fileLocation = await this._service.writeFile(data, data?.hapi);

			const response = h.response({
				status: "success",
				data: {
					fileLocation,
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
}
