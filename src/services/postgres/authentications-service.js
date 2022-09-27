import pkg from "pg";

import { InvariantError } from "../../exceptions/invariant-error.js";

const { Pool } = pkg;

export class AuthenticationsService {
	constructor() {
		/**
		 * @private
		 */
		this._pool = new Pool();
	}

	/**
	 * @param {string} token
	 */
	async addRefreshToken(token) {
		const query = {
			text: "INSERT INTO authentications VALUES ($1)",
			values: [token],
		};

		await this._pool.query(query);
	}

	/**
	 * @param {string} token
	 */
	async verifyRefreshToken(token) {
		const query = {
			text: "SELECT token FROM authentications WHERE token = $1",
			values: [token],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("Refresh token tidak valid");
		}
	}

	/**
	 * @param {string} token
	 */
	async deleteRefreshToken(token) {
		const query = {
			text: "DELETE FROM authentications WHERE token = $1",
			values: [token],
		};

		await this._pool.query(query);
	}
}
