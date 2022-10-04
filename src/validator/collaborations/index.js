import { CollaborationPayloadSchema } from "./schema.js";
import { InvariantError } from "../../exceptions/invariant-error.js";

export const CollaborationsValidator = {
	/**
	 * @param {any} payload
	 */
	validatePayload(payload) {
		const validationResult = CollaborationPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};
