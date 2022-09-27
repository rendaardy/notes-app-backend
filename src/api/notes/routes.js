/** @type {(handler: import("./handler.js").NotesHandler) => Array<import("@hapi/hapi").ServerRoute>} */
export const routes = (handler) => [
	{
		method: "POST",
		path: "/notes",
		handler: handler.postNoteHandler.bind(handler),
		options: {
			auth: "notesapp_jwt",
		},
	},
	{
		method: "GET",
		path: "/notes",
		handler: handler.getNotesHandler.bind(handler),
		options: {
			auth: "notesapp_jwt",
		},
	},
	{
		method: "GET",
		path: "/notes/{id}",
		handler: handler.getNoteByIdHandler.bind(handler),
		options: {
			auth: "notesapp_jwt",
		},
	},
	{
		method: "PUT",
		path: "/notes/{id}",
		handler: handler.putNoteByIdHandler.bind(handler),
		options: {
			auth: "notesapp_jwt",
		},
	},
	{
		method: "DELETE",
		path: "/notes/{id}",
		handler: handler.deleteNoteByIdHandler.bind(handler),
		options: {
			auth: "notesapp_jwt",
		},
	},
];
