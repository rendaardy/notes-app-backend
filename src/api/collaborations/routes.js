/**
 * @function
 * @param {import("./handler.js").CollaborationsHandler} handler
 * @return {Array<import("@hapi/hapi").ServerRoute>}
 */
export const routes = (handler) => [
	{
		method: "POST",
		path: "/collaborations",
		handler: handler.postCollaborationHandler,
		options: {
			auth: "notesapp_jwt",
		},
	},
	{
		method: "DELETE",
		path: "/collaborations",
		handler: handler.deleteCollaborationHandler,
		options: {
			auth: "notesapp_jwt",
		},
	},
];
