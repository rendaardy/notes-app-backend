import { nanoid } from "nanoid";

import { InvariantError } from "../../exceptions/invariant-error.js";
import { NotFoundError } from "../../exceptions/notfound-error.js";

/**
 * @typedef {Object} Note
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {Array<string>} tags
 * @property {string} createdAt
 * @property {string} updatedAt
 */

export class NotesService {
	constructor() {
		/**
		 * @private
		 * @type {Array<Note>}
		 */
		this._notes = [];
	}

	/**
	 * @public
	 * @param {{ title: string; body: string; tags: Array<string> }} payload
	 * @return {string}
	 * @throws {InvariantError}
	 */
	addNote({ title, body, tags }) {
		const id = nanoid(16);
		const createdAt = new Date().toISOString();
		const updatedAt = createdAt;

		/** @type {Note} */
		const newNote = {
			id,
			title,
			body,
			tags,
			createdAt,
			updatedAt,
		};

		this._notes.push(newNote);

		const isSuccess = this._notes.some((note) => note.id === id);

		if (!isSuccess) {
			throw new InvariantError("Catatan gagal ditambahkan");
		}

		return id;
	}

	/**
	 * @public
	 * @return {Array<Note>}
	 */
	getNotes() {
		return this._notes.slice();
	}

	/**
	 * @public
	 * @param {string} id
	 * @return {Note}
	 * @throws {NotFoundError}
	 */
	getNoteById(id) {
		const [note] = this._notes.filter((note) => note.id === id);

		if (!note) {
			throw new NotFoundError("Catatan tidak ditemukan");
		}

		return note;
	}

	/**
	 * @public
	 * @param {string} id
	 * @param {{ title: string; body: string; tags: Array<string> }} payload
	 * @throws {NotFoundError}
	 */
	editNoteById(id, { title, body, tags }) {
		const index = this._notes.findIndex((note) => note.id === id);

		if (index === -1) {
			throw new NotFoundError("Gagal memperbarui catatan. Id tidak ditemukan");
		}

		const updatedAt = new Date().toISOString();

		this._notes[index] = {
			...this._notes[index],
			title,
			body,
			tags,
			updatedAt,
		};
	}

	/**
	 * @public
	 * @param {string} id
	 * @throws {NotFoundError}
	 */
	deleteNoteById(id) {
		const index = this._notes.findIndex((note) => note.id === id);

		if (index === -1) {
			throw new NotFoundError("Catatan gagal dihapus. Id tidak ditemukan");
		}

		this._notes.splice(index, 1);
	}
}
