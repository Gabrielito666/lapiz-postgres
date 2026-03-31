const Query = require("#lib/query/index.js");

class DeletePig extends Query {
  constructor() {
    super("delete-pig", `
      DELETE FROM pigs
      WHERE id = $1
      RETURNING *
    `);
  }

  async run(pool, input) {
    const { result, database_error, unexpected_error } = await this.safeRawCall(pool, [input.id]);

    if (database_error) {
      throw database_error;
    }

    if (unexpected_error) {
      throw unexpected_error;
    }

    return result.rows[0] || null;
  }
}

module.exports = DeletePig;
