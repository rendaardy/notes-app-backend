import path from "node:path";
import process from "node:process";

/**
 * @function
 * @param {import("./handler.js").UploadsHandler} handler
 * @return {Array<import("@hapi/hapi").ServerRoute>}
 */
export const routes = (handler) => [
	{
		method: "POST",
		path: "/upload/images",
		handler: handler.postUploadImageHandler,
		options: {
			payload: {
				allow: "multipart/form-data",
				// @ts-ignore
				multipart: true,
				output: "stream",
			},
		},
	},
	{
		method: "GET",
		path: "/upload/{param*}",
		handler: {
			directory: {
				path: path.resolve(process.cwd(), "src", "api", "uploads", "file"),
			},
		},
	},
];
