import { ImageHeaderSchema } from "./schema.js";
import { InvariantError } from "../../exceptions/invariant-error.js";

export const UploadsValidator = {
	/**
	 * @param {any} headers
	 */
	validateHeaders(headers) {
		const validationResult = ImageHeaderSchema.validate(headers);

		if (validationResult.error) {
			throw new InvariantError(validationResult.error.message);
		}
	},
};
