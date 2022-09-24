/**
 * @function
 * @param {import("./handler.js").UsersHandler} handler
 * @return {Array<import("@hapi/hapi").ServerRoute>}
 */
export const routes = (handler) => [
	{
		method: "POST",
		path: "/users",
		handler: handler.postUserHandler,
	},
	{
		method: "GET",
		path: "/users/{id}",
		handler: handler.getUserByIdHandler,
	},
];
