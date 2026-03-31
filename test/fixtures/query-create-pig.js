const Query = require("#lib/query/index.js");

class CreatePig extends Query {
  constructor() {
    super("create-pig", `
      INSERT INTO pigs (name, weight)
      VALUES ($1, $2)
      RETURNING *
    `);
  }

  async run(pool, input) {
    const cleaned = Query.undefToNull(input);
    const { result, database_error, unexpected_error } = await this.safeRawCall(pool, [
      cleaned.name,
      cleaned.weight
    ]);

    if (database_error) {
      const column = Query.constraintToColumnName(database_error.constraint);
      return { error: `Duplicate value on ${column}` };
    }

    if (unexpected_error) {
      throw unexpected_error;
    }

    return result.rows[0];
  }
}

module.exports = CreatePig;
