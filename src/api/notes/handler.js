import { ClientError } from "../../exceptions/client-error.js";

export class NotesHandler {
	/**
	 * @param {import("../../services/in-memory/notes-service.js").NotesService} service
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
	 * @return {import("@hapi/hapi").Lifecycle.ReturnValue}
	 */
	postNoteHandler(request, h) {
		try {
			this._validator.validatePayload(request.payload);

			const {
				title = "Untitled",
				body,
				tags,
			} = /** @type {{ title: string; body: string; tags: Array<string>}} */ (request.payload);
			const noteId = this._service.addNote({ title, body, tags });

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
	 * @param {import("@hapi/hapi").Request} _request
	 * @param {import("@hapi/hapi").ResponseToolkit} _h
	 * @return {import("@hapi/hapi").Lifecycle.ReturnValue}
	 */
	getNotesHandler(_request, _h) {
		const notes = this._service.getNotes();

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
	 * @return {import("@hapi/hapi").Lifecycle.ReturnValue}
	 */
	getNoteByIdHandler(request, h) {
		try {
			const { id } = request.params;
			const note = this._service.getNoteById(id);

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
	 * @return {import("@hapi/hapi").Lifecycle.ReturnValue}
	 */
	putNoteByIdHandler(request, h) {
		try {
			const { id } = request.params;

			this._validator.validatePayload(request.payload);

			const { title, body, tags } =
				/** @type {{ title: string; body: string; tags: Array<string> }} */ (request.payload);

			this._service.editNoteById(id, { title, body, tags });

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
	 * @return {import("@hapi/hapi").Lifecycle.ReturnValue}
	 */
	deleteNoteByIdHandler(request, h) {
		try {
			const { id } = request.params;

			this._service.deleteNoteById(id);

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
