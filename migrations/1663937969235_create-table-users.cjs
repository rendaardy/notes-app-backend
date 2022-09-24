/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
	pgm.createTable("users", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true,
		},
		username: {
			type: "VARCHAR(50)",
			unique: true,
			notNull: true,
		},
		password: {
			type: "TEXT",
			notNull: true,
		},
		fullname: {
			type: "TEXT",
			notNull: true,
		},
	});
};

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
	pgm.dropTable("users");
};
