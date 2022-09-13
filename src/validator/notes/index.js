import { NotePayloadSchema } from "./schema.js";
import { InvariantError } from "../../exceptions/invariant-error.js";

/**
 * @typedef {Object} Payload
 * @property {string} title
 * @property {string} body
 * @property {Array<string>} tags
 */

/**
 * @typedef {Object} Validator
 * @property {(payload: Payload) => void} validatePayload
 */

/** @type {Validator} */
export const NoteValidator = {
	validatePayload(payload) {
		const validationResult = NotePayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};
