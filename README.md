# 📦 lapiz-postgres

A lightweight and structured query system for PostgreSQL using `pg`. This package helps you organize your queries as reusable classes with strong typing patterns (via JSDoc) and safer execution methods.

---

## 🚀 Features

* Class-based query structure
* Named queries for better performance (prepared statements)
* Built-in error handling (`safeRawCall`)
* Utility helpers for common transformations
* Fully compatible with `pg` (`Pool` and `PoolClient`)

---

## 📥 Installation

```bash
npm install lapiz-postgres
```

---

## 🧠 Core Concepts

### 1. Query Class

All queries must extend the base `Query` class and implement the `.run()` method.

```js
const Query = require("lapiz-postgres/query");

/**
 * @import {IQuery} from "lapiz-postgres/query"
 */
 /**
  * @typedef {{ id_ number }} Input
  * @typedef {{id: number; name: string; email: string|null}|null>}}
  */
/**
 * @class
 * @extends {Query<"get-user-by-id", Input, Output>} 
 * @implements {IQuery<"get-user-by-id", Input, Output>} 
 */
class GetUserById extends Query {
  constructor() {
    super("get-user-by-id", `
      SELECT id, name, email
      FROM users
      WHERE id = $1
    `);
  }

 /** @type {IQuery<"get-user-by-id", Input, Output>["run"]}*/
  async run(pool, input) {
    const result = await this.rawCall(pool, [input.id]);
    return result.rows[0] || null;
  }
}

module.exports = GetUserById;
```

---

### 2. Database Class

The `DB` class initializes a PostgreSQL connection pool and registers your queries.

```js
const DB = require("lapiz-postgres/db");
const GetUserById = require("./queries/GetUserById");

const db = new DB(
  {
    db_host: "localhost",
    db_port: 5432,
    db_user: "postgres",
    db_password: "password",
    db_name: "my_database"
  },
  new GetUserById()
);
```

---

### 3. Executing Queries

Use `.exec()` to run a query by name.

```js
async function main() {
  const user = await db.exec("get-user-by-id", { id: 1 });
  console.log(user);
}

main();
```

---

## 🛡️ Error Handling

If you expect possible database errors (e.g. unique constraint violations), use `safeRawCall`:

```js
class CreateUser extends Query {
  constructor() {
    super("create-user", `
      INSERT INTO users (name, email)
      VALUES ($1, $2)
      RETURNING *
    `);
  }

  async run(pool, input) {
    const { result, database_error, unexpected_error } =
      await this.safeRawCall(pool, [input.name, input.email]);

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
```

---

## 🧩 Utilities

### `Query.undefToNull(obj)`

Converts `undefined` values to `null` (useful for SQL inserts/updates):

```js
const cleaned = Query.undefToNull({
  name: "John",
  email: undefined
});

// Result:
// { name: "John", email: null }
```

---

### `Query.constraintToColumnName(constraint)`

Extracts column name from PostgreSQL constraint:

```js
const column = Query.constraintToColumnName("users_email_key");
// → "email"
```

---

## 📁 Suggested Project Structure

```
project/
│
├── db/
│   └── index.js
│
├── queries/
│   ├── GetUserById.js
│   └── CreateUser.js
│
└── app.js
```

---

## 💡 Best Practices

* Use one class per query
* Keep SQL inside the query class
* Use `safeRawCall` for inserts/updates with constraints
* Use `rawCall` when errors are not expected
* Name queries uniquely for better prepared statement reuse

---

## 📜 License

MIT

