/**
 * @import {PoolClient} from "pg"
 */
const {Pool} = require("pg");

if(!process.env.DB_HOST) throw new Error("Must define DB_HOST env var");
if(!process.env.DB_PORT || isNaN(+process.env.DB_PORT)) throw new Error("Must define DB_PORT env var and this must be a number");
if(!process.env.DB_USER) throw new Error("Must define DB_USER env var");
if(!process.env.DB_PASSWORD) throw new Error("Must define DB_PASSWORD env var");
if(!process.env.DB_NAME) throw new Error("Must define DB_NAME env var");

const createTestPool = () =>  new Pool({
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME
});

/**
 * Helper: crea cliente con transacción aislada
 * @param {Pool} pool
 * @param {(client: PoolClient) => any} fn
 */
async function transactionWithRollback(pool, fn)
{
	let err;
	const client = await pool.connect();
	try
	{
		await client.query("BEGIN");
		await fn(client);
	}
	catch(error)
	{
		err = error;
	}
	finally
	{
		await client.query("ROLLBACK");
		client.release();
		if(err) throw err;
	}
}

module.exports = { transactionWithRollback, createTestPool };
