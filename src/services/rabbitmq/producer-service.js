import process from "node:process";
import { Buffer } from "node:buffer";

import amqp from "amqplib";

export const ProducerService = {
	/**
	 * @param {string} queue
	 * @param {string} message
	 */
	async sendMessage(queue, message) {
		const { RABBITMQ_SERVER } = process.env;

		if (!RABBITMQ_SERVER) {
			throw new Error("RABBITMQ_SERVER must be defined");
		}

		const connection = await amqp.connect(RABBITMQ_SERVER);
		const channel = await connection.createChannel();

		await channel.assertQueue(queue, { durable: true });
		await channel.sendToQueue(queue, Buffer.from(message));

		setTimeout(() => {
			connection.close();
		}, 1000);
	},
};
