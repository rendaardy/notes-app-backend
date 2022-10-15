import { ExportNotesPayloadSchema } from "./schema.js";
import { InvariantError } from "../../exceptions/invariant-error.js";

export const ExportsValidator = {
	/**
	 * @param {any} payload
	 */
	validatePayload(payload) {
		const validationResult = ExportNotesPayloadSchema.validate(payload);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};
