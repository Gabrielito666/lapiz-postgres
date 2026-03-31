const DB = require("#lib/db/index.js");
const CreatePig = require("#test/fixtures/query-create-pig.js");
const DeletePig = require("#test/fixtures/query-delete-pig.js");

const db = new DB(
  {
    db_host: process.env.DB_HOST || "localhost",
    db_port: parseInt(process.env.DB_PORT || "5432"),
    db_user: process.env.DB_USER || "postgres",
    db_password: process.env.DB_PASSWORD || "postgres",
    db_name: process.env.DB_NAME || "postgres"
  },
  new CreatePig(),
  new DeletePig()
);

module.exports = db;
