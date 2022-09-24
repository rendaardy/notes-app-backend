import { InvariantError } from "../../exceptions/invariant-error.js";
import { UserPayloadSchema } from "./schema.js";

/**
 * @typedef {object} Validator
 * @property {(payload: any) => void} validatePayload
 */

/** @type {Validator} */
export const UsersValidator = {
	validatePayload(payload) {
		const validationResult = UserPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};
