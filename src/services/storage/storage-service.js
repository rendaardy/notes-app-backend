import fs from "node:fs";

export class StorageService {
	/**
	 * @param {string} folder
	 */
	constructor(folder) {
		this._folder = folder;

		if (!fs.existsSync(folder)) {
			fs.mkdirSync(folder, { recursive: true });
		}
	}

	/**
	 * @param {import("node:stream").Readable} file
	 * @param {any} meta
	 * @return {Promise<string>}
	 */
	writeFile(file, meta) {
		const filename = `${new Date().getTime()}${meta.filename}`;
		const path = `${this._folder}/${filename}`;
		const fileStream = fs.createWriteStream(path);

		return new Promise((resolve, reject) => {
			fileStream.on("error", (error) => reject(error));

			file.pipe(fileStream);

			file.on("end", () => resolve(filename));
		});
	}
}
