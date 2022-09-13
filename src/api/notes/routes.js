/** @type {(handler: import("./handler.js").NotesHandler) => Array<import("@hapi/hapi").ServerRoute>} */
export const routes = (handler) => [
	{
		method: "POST",
		path: "/notes",
		handler: handler.postNoteHandler.bind(handler),
	},
	{
		method: "GET",
		path: "/notes",
		handler: handler.getNotesHandler.bind(handler),
	},
	{
		method: "GET",
		path: "/notes/{id}",
		handler: handler.getNoteByIdHandler.bind(handler),
	},
	{
		method: "PUT",
		path: "/notes/{id}",
		handler: handler.putNoteByIdHandler.bind(handler),
	},
	{
		method: "DELETE",
		path: "/notes/{id}",
		handler: handler.deleteNoteByIdHandler.bind(handler),
	},
];
