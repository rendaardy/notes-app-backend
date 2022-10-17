import process from "node:process";

import { createClient } from "redis";

export class CacheService {
	constructor() {
		const { REDIS_SERVER } = process.env;

		if (!REDIS_SERVER) {
			throw new Error("REDIS_SERVER must be defined");
		}

		this._client = createClient({
			socket: {
				host: REDIS_SERVER,
			},
		});

		this._client.on("error", (error) => {
			console.error(error);
		});

		this._client.connect();
	}

	/**
	 * @param {string} key
	 * @param {string} value
	 * @param {number} [expirationInSecond=3600]
	 */
	async set(key, value, expirationInSecond = 3600) {
		await this._client.set(key, value, { EX: expirationInSecond });
	}

	/**
	 * @param {string} key
	 * @return {Promise<string>}
	 */
	async get(key) {
		const result = await this._client.get(key);

		if (result === null) {
			throw new Error("Cache tidak ditemukan");
		}

		return result;
	}

	/**
	 * @param {string} key
	 * @return {Promise<number>}
	 */
	delete(key) {
		return this._client.del(key);
	}
}
