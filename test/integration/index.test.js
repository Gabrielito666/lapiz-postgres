const { test, before, after } = require("node:test");
const assert = require("node:assert");
const db = require("#test/fixtures/db.js");

test("CreatePig inserts a pig and returns it", async () => {
  const pig = await db.exec("create-pig", { name: "Provina", weight: 120.5 });
  assert.strictEqual(pig.name, "Provina");
  assert.strictEqual(pig.weight, "120.50");
  assert.ok(pig.id);
});

test("DeletePig removes a pig and returns it", async () => {
  const created = await db.exec("create-pig", { name: "ToDelete", weight: 50 });
  const deleted = await db.exec("delete-pig", { id: created.id });
  assert.strictEqual(deleted.name, "ToDelete");
});

test("DeletePig returns null for non-existent id", async () => {
  const deleted = await db.exec("delete-pig", { id: 999999 });
  assert.strictEqual(deleted, null);
});
