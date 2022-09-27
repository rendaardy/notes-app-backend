/**
 * @function
 * @param {import("./handler.js").AuthenticationsHandler} handler
 * @return {Array<import("@hapi/hapi").ServerRoute>}
 */
export const routes = (handler) => [
	{
		method: "POST",
		path: "/authentications",
		handler: handler.postAuthenticationHandler,
	},
	{
		method: "PUT",
		path: "/authentications",
		handler: handler.putAuthenticationHandler,
	},
	{
		method: "DELETE",
		path: "/authentications",
		handler: handler.deleteAuthenticationHandler,
	},
];
