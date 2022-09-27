import {
	PostAuthenticationPayloadSchema,
	PutAuthenticationPayloadSchema,
	DeleteAuthenticationPayloadSchema,
} from "./schema.js";
import { InvariantError } from "../../exceptions/invariant-error.js";

/**
 * @typedef {object} Validator
 * @property {(payload: any) => void} validatePostPayload
 * @property {(payload: any) => void} validatePutPayload
 * @property {(payload: any) => void} validateDeletePayload
 */

/** @type {Validator} */
export const AuthenticationsValidator = {
	validatePostPayload(payload) {
		const validationResult = PostAuthenticationPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validatePutPayload(payload) {
		const validationResult = PutAuthenticationPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
	validateDeletePayload(payload) {
		const validationResult = DeleteAuthenticationPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};
