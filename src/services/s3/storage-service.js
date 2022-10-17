import process from "node:process";
import { Buffer } from "node:buffer";

import AWS from "aws-sdk";

export class StorageService {
	constructor() {
		this._s3 = new AWS.S3({
			region: "ap-southeast-3",
		});
	}

	/**
	 * @param {import("node:stream").Readable} file
	 * @param {any} meta
	 * @return {Promise<string>}
	 */
	async writeFile(file, meta) {
		const fileBuffer = new Promise((resolve, reject) => {
			let data = Buffer.from([]);

			file.on("error", (error) => reject(error));

			file.on("data", (chunk) => {
				data = Buffer.concat([data, chunk]);
			});

			file.on("end", () => resolve(data));
		});
		const { AWS_BUCKET_NAME } = process.env;

		if (!AWS_BUCKET_NAME) {
			throw new Error("AWS_BUCKET_NAME must be defined");
		}

		const parameter = {
			Bucket: AWS_BUCKET_NAME,
			Key: new Date().getTime() + meta.filename,
			Body: await fileBuffer,
			ContentType: meta.headers["content-type"],
		};

		return new Promise((resolve, reject) => {
			this._s3.upload(
				parameter,
				/**
				 * @param {any} error
				 * @param {any} data
				 */
				(error, data) => {
					if (error) {
						reject(error);
					} else {
						console.log(data);
						resolve(data.Location);
					}
				},
			);
		});
	}
}
