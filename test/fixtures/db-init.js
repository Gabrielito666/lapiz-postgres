const DB = require("#lib/db/index.js");
const Query = require("#lib/query/index.js");

class CreateTablePigs extends Query {
  constructor() {
    super("create-table-pigs", `
      CREATE TABLE IF NOT EXISTS pigs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        weight DECIMAL(10,2)
      )
    `);
  }

  async run(pool) {
    return this.rawCall(pool, []);
  }
}

const db = new DB(
  {
    db_host: process.env.DB_HOST || "localhost",
    db_port: parseInt(process.env.DB_PORT || "5432"),
    db_user: process.env.DB_USER || "postgres",
    db_password: process.env.DB_PASSWORD || "postgres",
    db_name: process.env.DB_NAME || "postgres"
  },
  new CreateTablePigs()
);

db.exec("create-table-pigs").then(() => {
  process.exit(0);
});
