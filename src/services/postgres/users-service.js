import { default as pkg } from "pg";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

import { InvariantError } from "../../exceptions/invariant-error.js";
import { NotFoundError } from "../../exceptions/notfound-error.js";
import { AuthenticationError } from "../../exceptions/authentication-error.js";

const { Pool } = pkg;

/**
 * @typedef {object} User
 * @property {string} id
 * @property {string} username
 * @property {string} password
 * @property {string} fullname
 */

export class UsersService {
	constructor() {
		this._pool = new Pool();
	}

	/**
	 * @param {Omit<User, "id">} payload
	 * @return {Promise<string>}
	 */
	async addUser({ username, password, fullname }) {
		await this.verifyNewUsername(username);

		const id = `user-${nanoid(16)}`;
		const hashedPassword = await bcrypt.hash(password, 10);
		const query = {
			text: "INSERT INTO users VALUES ($1, $2, $3, $4) RETURNING id",
			values: [id, username, hashedPassword, fullname],
		};
		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new InvariantError("User gagal ditambahkan");
		}

		return result.rows[0].id;
	}

	/**
	 * @param {string} username
	 */
	async verifyNewUsername(username) {
		const query = {
			text: "SELECT username FROM users WHERE username = $1",
			values: [username],
		};

		const result = await this._pool.query(query);

		if (result.rows.length > 0) {
			throw new InvariantError("Gagal menambahkan user. Username sudah digunakan.");
		}
	}

	/**
	 * @param {string} username
	 * @param {string} password
	 * @return {Promise<string>}
	 */
	async verifyUserCredential(username, password) {
		const query = {
			text: "SELECT id, password FROM users WHERE username = $1",
			values: [username],
		};

		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new AuthenticationError("Kredensial yang Anda berikan salah");
		}

		const { id, password: hashedPassword } = result.rows[0];
		const match = await bcrypt.compare(password, hashedPassword);

		if (!match) {
			throw new AuthenticationError("Kredensial yang Anda berikan salah");
		}

		return id;
	}

	/**
	 * @param {string} userId
	 * @return {Promise<User>}
	 */
	async getUserById(userId) {
		const query = {
			text: "SELECT id, username, fullname FROM users WHERE id = $1",
			values: [userId],
		};
		const result = await this._pool.query(query);

		if (!result.rows.length) {
			throw new NotFoundError("User tidak ditemukan");
		}

		return result.rows[0];
	}

	/**
	 * @param {string} username
	 * @return {Promise<Array<User>>}
	 */
	async getUsersByUsername(username) {
		const query = {
			text: "SELECT id, username, fullname FROM users WHERE username LIKE $1",
			values: [`%${username}%`],
		};
		const result = await this._pool.query(query);

		return result.rows;
	}
}
