/**
 * @function
 * @param {import("./handler.js").ExportsHandler} handler
 * @return {Array<import("@hapi/hapi").ServerRoute>}
 */
export const routes = (handler) => [
	{
		method: "POST",
		path: "/export/notes",
		handler: handler.postExportNotesHandler,
		options: {
			auth: "notesapp_jwt",
		},
	},
];
