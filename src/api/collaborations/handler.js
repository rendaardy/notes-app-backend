import { ClientError } from "../../exceptions/client-error.js";

/**
 * @typedef {object} Payload
 * @property {string} noteId
 * @property {string} userId
 */

export class CollaborationsHandler {
	/**
	 * @param {import("../../services/postgres/collaborations-service.js").CollaborationsService} collaborationsService
	 * @param {import("../../services/postgres/notes-service.js").NotesService} notesService
	 * @param {import("../../validator/collaborations/index.js").CollaborationsValidator} validator
	 */
	constructor(collaborationsService, notesService, validator) {
		/**
		 * @private
		 */
		this._collaborationsService = collaborationsService;

		/**
		 * @private
		 */
		this._notesService = notesService;

		/**
		 * @private
		 */
		this._validator = validator;

		this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
		this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
	}

	/**
	 * @param {import("@hapi/hapi").Request} request
	 * @param {import("@hapi/hapi").ResponseToolkit} h
	 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
	 */
	async postCollaborationHandler(request, h) {
		try {
			this._validator.validatePayload(request.payload);

			const { id: credentialId } = /** @type {{ id: string }} */ (request.auth.credentials);
			const { noteId, userId } = /** @type {Payload} */ (request.payload);

			await this._notesService.verifyNoteOwner(noteId, credentialId);
			const collaborationId = await this._collaborationsService.addCollaboration(noteId, userId);

			const response = h.response({
				status: "success",
				message: "Kolaborasi berhasil ditambahkan",
				data: {
					collaborationId,
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
	async deleteCollaborationHandler(request, h) {
		try {
			this._validator.validatePayload(request.payload);

			const { id: credentialId } = /** @type {{ id: string }} */ (request.auth.credentials);
			const { noteId, userId } = /** @type {Payload} */ (request.payload);

			await this._notesService.verifyNoteOwner(noteId, credentialId);
			await this._collaborationsService.deleteCollaboration(noteId, userId);

			return {
				status: "success",
				message: "Kolaborasi berhasil dihapus",
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
