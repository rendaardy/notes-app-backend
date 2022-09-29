/* eslint-disable camelcase */

exports.shorthands = undefined;

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.up = (pgm) => {
  // Create a new user
  pgm.sql("INSERT INTO users (id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old_notes')");

  // Assign old notes' owner to NULL
  pgm.sql("UPDATE notes SET owner = 'old_notes' WHERE owner is NULL");

  // Create constraint foreign key
  pgm.addConstraint("notes", "fk_notes.owner_users.id", "FOREIGN KEY (owner) REFERENCES users(id) ON DELETE CASCADE");
};

/**
 * @function
 * @param {import("node-pg-migrate").MigrationBuilder} pgm
 */
exports.down = (pgm) => {
  pgm.dropConstraint("notes", "fk_notes.owner_users.id");
  pgm.sql("UPDATE notes SET owner = NULL WHERE owner = 'old_notes'");
  pgm.sql("DELETE FROM users WHERE id = 'old_notes'");
};
