import { default as pkg } from "pg";
import { nanoid } from "nanoid";

import { InvariantError } from "../../exceptions/invariant-error.js";
import { NotFoundError } from "../../exceptions/notfound-error.js";

/**
 * @typedef {object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {Array<string>} tags
 * @property {string} createdAt
 * @property {string} updatedAt
 */

/**
 * @typedef {Pick<Note, "title" | "body" | "tags">} Payload
 */

const { Pool } = pkg;

/**
 * @param {any} data
 * @return {Note}
 */
function mapDBToNote(data) {
	return {
		id: data.id,
		title: data.title,
		body: data.body,
		tags: data.tags,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
	};
}

export class NotesService {
	constructor() {
		/**
		 * @private
		 */
		this._pool = new Pool();
	}

	/**
	 * @public
	 * @param {Payload} paylaod
	 * @return {Promise<number>}
	 */
	async addNote({ title, body, tags }) {
		const id = nanoid(16);
		const createdAt = new Date().toISOString();
		const updatedAt = createdAt;

		const query = {
			text: "INSERT INTO notes VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
			values: [id, title, body, tags, createdAt, updatedAt],
		};

		const result = await this._pool.query(query);

		if (!result.rows[0].id) {
			throw new InvariantError("Catatan gagal ditambahkan");
		}

		return result.rows[0].id;
	}

	/**
	 * @public
	 * @return {Promise<Array<Note>>}
	 */
	async getNotes() {
		const result = await this._pool.query("SELECT * FROM notes");

		return result.rows.map(mapDBToNote);
	}

	/**
	 * @public
	 * @param {string} id
	 * @return {Promise<Note>}
	 */
	async getNoteById(id) {
		const result = await this._pool.query({
			text: "SELECT * FROM notes WHERE id = $1",
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
	 * @param {Payload} payload
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
}
