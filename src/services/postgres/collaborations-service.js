import pg from "pg";
import { nanoid } from "nanoid";

import { InvariantError } from "../../exceptions/invariant-error.js";
import { AuthorizationError } from "../../exceptions/authorization-error.js";

const { Pool } = pg;

export class CollaborationsService {
	constructor() {
		/**
		 * @private
		 * @readonly
		 */
		this._pool = new Pool();
	}

	/**
	 * @param {string} noteId
	 * @param {string} userId
	 * @return {Promise<string>}
	 */
	async addCollaboration(noteId, userId) {
		const id = `collab-${nanoid(16)}`;
		const query = {
			text: "INSERT INTO collaborations VALUES ($1, $2, $3) RETURNING id",
			values: [id, noteId, userId],
		};
		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("Kolaborasi gagal ditambahkan");
		}

		return result.rows[0].id;
	}

	/**
	 * @param {string} noteId
	 * @param {string} userId
	 */
	async deleteCollaboration(noteId, userId) {
		const query = {
			text: "DELETE FROM collaborations WHERE note_id = $1 AND user_id = $2 RETURNING id",
			values: [noteId, userId],
		};
		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("Kolaborasi gagal dihapus");
		}
	}

	/**
	 * @param {string} noteId
	 * @param {string} userId
	 */
	async verifyCollaborator(noteId, userId) {
		const query = {
			text: "SELECT * FROM collaborations WHERE note_id = $1 AND user_id = $2",
			values: [noteId, userId],
		};
		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new AuthorizationError("Anda tidak berhak mengakses resource ini");
		}
	}
}
