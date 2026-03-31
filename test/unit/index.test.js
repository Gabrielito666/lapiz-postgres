const { test } = require("node:test");
const assert = require("node:assert");
const Query = require("#lib/query/index.js");

test("Query.undefToNull converts undefined to null", () => {
  const result = Query.undefToNull({ name: "Pepa", email: undefined });
  assert.strictEqual(result.name, "Pepa");
  assert.strictEqual(result.email, null);
});

test("Query.undefToNull keeps non-undefined values", () => {
  const result = Query.undefToNull({ name: "Pepa", age: 5 });
  assert.strictEqual(result.name, "Pepa");
  assert.strictEqual(result.age, 5);
});

test("Query.undefToNull handles empty object", () => {
  const result = Query.undefToNull({});
  assert.deepStrictEqual(result, {});
});

test("Query.constraintToColumnName extracts column from unique constraint", () => {
  const result = Query.constraintToColumnName("users_email_key");
  assert.strictEqual(result, "email");
});

test("Query.constraintToColumnName returns null for pkey (not supported)", () => {
  const result = Query.constraintToColumnName("pigs_pkey");
  assert.strictEqual(result, null);
});

test("Query.constraintToColumnName returns null for unknown pattern", () => {
  const result = Query.constraintToColumnName("some_check");
  assert.strictEqual(result, null);
});
