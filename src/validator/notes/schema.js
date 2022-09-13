import { default as Joi } from "joi";

export const NotePayloadSchema = Joi.object({
	title: Joi.string().required(),
	body: Joi.string().required(),
	tags: Joi.array().items(Joi.string()).required(),
});
