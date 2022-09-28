import { ClientError } from "../../exceptions/client-error.js";

export class NotesHandler {
	/**
	 * @param {import("../../services/postgres/notes-service.js").NotesService} service
	 * @param {import("../../validator/notes/index.js").NoteValidator} validator
	 */
	constructor(service, validator) {
		/**
		 * @private
		 */
		this._service = service;

		/**
		 * @private
		 */
		this._validator = validator;
	}

	/**
	 * @public
	 * @param {import("@hapi/hapi").Request} request
	 * @param {import("@hapi/hapi").ResponseToolkit} h
	 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
	 */
	async postNoteHandler(request, h) {
		try {
			this._validator.validatePayload(request.payload);

			const {
				title = "Untitled",
				body,
				tags,
			} = /** @type {{ title: string; body: string; tags: Array<string>}} */ (request.payload);
			const { id: credentialId } = /** @type {{ id: string }} */ (request.auth.credentials);
			const noteId = await this._service.addNote({ title, body, tags, owner: credentialId });

			const response = h.response({
				status: "success",
				message: "Catatan berhasil ditambahkan",
				data: {
					noteId,
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
				status: "fail",
				message: "Maaf, terjadi kegagalan pada server kami.",
			});
			response.code(500);

			return response;
		}
	}

	/**
	 * @public
	 * @param {import("@hapi/hapi").Request} request
	 * @param {import("@hapi/hapi").ResponseToolkit} _h
	 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
	 */
	async getNotesHandler(request, _h) {
		const { id: credentialId } = /** @type {{ id: string }} */ (request.auth.credentials);
		const notes = await this._service.getNotes(credentialId);

		return {
			status: "success",
			data: {
				notes,
			},
		};
	}

	/**
	 * @public
	 * @param {import("@hapi/hapi").Request} request
	 * @param {import("@hapi/hapi").ResponseToolkit} h
	 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
	 */
	async getNoteByIdHandler(request, h) {
		try {
			const { id } = request.params;
			const { id: credentialId } = /** @type {{ id: string }} */ (request.auth.credentials);

			await this._service.verifyNoteOwner(id, credentialId);

			const note = await this._service.getNoteById(id);

			return {
				status: "success",
				data: {
					note,
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
				status: "fail",
				message: "Maaf, terjadi kegagalan pada server kami.",
			});
			response.code(500);

			return response;
		}
	}

	/**
	 * @public
	 * @param {import("@hapi/hapi").Request} request
	 * @param {import("@hapi/hapi").ResponseToolkit} h
	 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
	 */
	async putNoteByIdHandler(request, h) {
		try {
			const { id } = request.params;
			const { id: credentialId } = /** @type {{ id: string }} */ (request.auth.credentials);

			this._validator.validatePayload(request.payload);

			await this._service.verifyNoteOwner(id, credentialId);

			const { title, body, tags } =
				/** @type {{ title: string; body: string; tags: Array<string> }} */ (request.payload);

			await this._service.editNoteById(id, { title, body, tags });

			return {
				status: "success",
				message: "Catatan berhasil diperbarui",
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
				status: "fail",
				message: "Maaf, terjadi kegagalan pada server kami.",
			});
			response.code(500);

			return response;
		}
	}

	/**
	 * @public
	 * @param {import("@hapi/hapi").Request} request
	 * @param {import("@hapi/hapi").ResponseToolkit} h
	 * @return {Promise<import("@hapi/hapi").Lifecycle.ReturnValue>}
	 */
	async deleteNoteByIdHandler(request, h) {
		try {
			const { id } = request.params;
			const { id: credentialId } = /** @type {{ id: string }} */ (request.auth.credentials);

			await this._service.verifyNoteOwner(id, credentialId);
			await this._service.deleteNoteById(id);

			return {
				status: "success",
				message: "Catatan berhasil dihapus",
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
				status: "fail",
				message: "Maaf, terjadi kegagalan pada server kami.",
			});
			response.code(500);

			return response;
		}
	}
}
