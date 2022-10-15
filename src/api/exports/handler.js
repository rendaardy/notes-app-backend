import { ClientError } from "../../exceptions/client-error.js";

export class ExportsHandler {
	/**
	 * @param {import("../../services/rabbitmq/producer-service.js").ProducerService} service
	 * @param {import("../../validator/exports/index.js").ExportsValidator} validator
	 */
	constructor(service, validator) {
		this._service = service;
		this._validator = validator;

		this.postExportNotesHandler = this.postExportNotesHandler.bind(this);
	}

	/**
	 * @param {import("@hapi/hapi").Request} request
	 * @param {import("@hapi/hapi").ResponseToolkit} h
	 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
	 */
	async postExportNotesHandler(request, h) {
		try {
			this._validator.validatePayload(request.payload);

			const { id: userId } = /** @type {{ id: string }} */ (request.auth.credentials);
			const { targetEmail } = /** @type {{ targetEmail: string }} */ (request.payload);

			const message = {
				userId,
				targetEmail,
			};

			await this._service.sendMessage("export:notes", JSON.stringify(message));

			const response = h.response({
				status: "success",
				message: "Permintaan Anda dalam antrean",
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
