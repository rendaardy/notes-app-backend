/* eslint-disable camelcase */

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
	pgm.createTable("notes", {
		id: {
			type: "VARCHAR(50)",
			primaryKey: true,
		},
		title: {
			type: "TEXT",
			notNull: true,
		},
		body: {
			type: "TEXT",
			notNull: true,
		},
		tags: {
			type: "TEXT[]",
			notNull: true,
		},
		created_at: {
			type: "TEXT",
			notNull: true,
		},
		updated_at: {
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
	pgm.dropTable("notes");
};
