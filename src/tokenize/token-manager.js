import process from "node:process";
import Jwt from "@hapi/jwt";

import { InvariantError } from "../exceptions/invariant-error.js";

/**
 * @typedef {object} TokenManagerType
 * @property {(payload: any) => string} generateAccessToken
 * @property {(payload: any) => string} generateRefreshToken
 * @property {(refreshToken: string) => any} verifyRefreshToken
 */

/** @type {TokenManagerType} */
export const TokenManager = {
	generateAccessToken(payload) {
		const { ACCESS_TOKEN_KEY } = process.env;

		if (!ACCESS_TOKEN_KEY) {
			throw new Error("ACCESS_TOKEN_KEY must be defined");
		}

		return Jwt.token.generate(payload, ACCESS_TOKEN_KEY);
	},
	generateRefreshToken(payload) {
		const { REFRESH_TOKEN_KEY } = process.env;

		if (!REFRESH_TOKEN_KEY) {
			throw new Error("REFRESH_TOKEN_KEY must be defined");
		}

		return Jwt.token.generate(payload, REFRESH_TOKEN_KEY);
	},
	verifyRefreshToken(refreshToken) {
		try {
			const artifacts = Jwt.token.decode(refreshToken);
			const { REFRESH_TOKEN_KEY } = process.env;

			if (!REFRESH_TOKEN_KEY) {
				throw new Error("REFRESH_TOKEN_KEY must be defined");
			}

			Jwt.token.verifySignature(artifacts, REFRESH_TOKEN_KEY);

			const { payload } = artifacts.decoded;

			return payload;
		} catch (error) {
			if (error instanceof Error) {
				console.error(error);
			}

			throw new InvariantError("Refresh token tidak valid");
		}
	},
};
