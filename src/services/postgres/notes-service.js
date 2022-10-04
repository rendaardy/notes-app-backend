import { default as pkg } from "pg";
import { nanoid } from "nanoid";

import { InvariantError } from "../../exceptions/invariant-error.js";
import { NotFoundError } from "../../exceptions/notfound-error.js";
import { AuthorizationError } from "../../exceptions/authorization-error.js";

/**
 * @typedef {object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {Array<string>} tags
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string} owner
 * @property {string} username
 */

/**
 * @typedef {Pick<Note, "title" | "body" | "tags" | "owner">} Payload
 */

const { Pool } = pkg;

/**
 * @param {any} data
 * @return {Omit<Note, "owner">}
 */
function mapDBToNote(data) {
	return {
		id: data.id,
		title: data.title,
		body: data.body,
		tags: data.tags,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
		username: data.username,
	};
}

export class NotesService {
	/**
	 * @param {import("./collaborations-service.js").CollaborationsService} collaborationsService
	 */
	constructor(collaborationsService) {
		/**
		 * @private
		 */
		this._pool = new Pool();

		/**
		 * @private
		 */
		this._collaborationsService = collaborationsService;
	}

	/**
	 * @public
	 * @param {Payload} paylaod
	 * @return {Promise<number>}
	 */
	async addNote({ title, body, tags, owner }) {
		const id = nanoid(16);
		const createdAt = new Date().toISOString();
		const updatedAt = createdAt;

		const query = {
			text: "INSERT INTO notes VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id",
			values: [id, title, body, tags, createdAt, updatedAt, owner],
		};

		const result = await this._pool.query(query);

		if (!result.rows[0].id) {
			throw new InvariantError("Catatan gagal ditambahkan");
		}

		return result.rows[0].id;
	}

	/**
	 * @public
	 * @param {string} owner
	 * @return {Promise<Array<Omit<Note, "owner">>>}
	 */
	async getNotes(owner) {
		const result = await this._pool.query({
			text: `
        SELECT notes.* FROM notes
        LEFT JOIN collaborations ON collaborations.note_id = notes.id
        WHERE notes.owner = $1 OR collaborations.user_id = $1
        GROUP BY notes.id
      `,
			values: [owner],
		});

		return result.rows.map(mapDBToNote);
	}

	/**
	 * @public
	 * @param {string} id
	 * @return {Promise<Omit<Note, "owner">>}
	 */
	async getNoteById(id) {
		const result = await this._pool.query({
			text: `
        SELECT notes.*, users.username FROM notes
        LEFT JOIN users ON users.id = notes.owner
        WHERE notes.id = $1
      `,
			values: [id],
		});

		if (!result.rows.length) {
			throw new NotFoundError("Catatan tidak ditemukan");
		}

		return result.rows.map(mapDBToNote)[0];
	}

	/**
	 * @public
	 * @param {string} id
	 * @param {Omit<Payload, "owner">} payload
	 */
	async editNoteById(id, { title, body, tags }) {
		const updatedAt = new Date().toISOString();
		const query = {
			text: `
        UPDATE notes
        SET title = $1, body = $2, tags = $3, updated_at = $4
        WHERE id = $5
        RETURNING id
      `,
			values: [title, body, tags, updatedAt, id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Gagal memperbarui catatan. Id tidak ditemukan");
		}
	}

	/**
	 * @param {string} id
	 */
	async deleteNoteById(id) {
		const query = {
			text: "DELETE FROM notes WHERE id = $1 RETURNING id",
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Catatan gagal dihapus. Id tidak ditemukan");
		}
	}

	/**
	 * @public
	 * @param {string} id
	 * @param {string} owner
	 */
	async verifyNoteOwner(id, owner) {
		const query = {
			text: "SELECT * FROM notes WHERE id = $1",
			values: [id],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("Catatan tidak ditemukan");
		}

		const note = result.rows[0];

		if (note.owner !== owner) {
			throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
		}
	}

	/**
	 * @param {string} noteId
	 * @param {string} userId
	 */
	async verifyNoteAccess(noteId, userId) {
		try {
			await this.verifyNoteOwner(noteId, userId);
		} catch (error) {
			if (error instanceof NotFoundError) {
				throw error;
			}

			// eslint-disable-next-line no-useless-catch
			try {
				await this._collaborationsService.verifyCollaborator(noteId, userId);
			} catch (error) {
				throw error;
			}
		}
	}
}
