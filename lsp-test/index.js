const Query = require("#lib/query/index.js");
const DB = require("#lib/db/index.js");

/**
 * @import {IQuery} from "#lib/query/index.js"
 */

/**
 * @class
 * @implements {IQuery<"query-1", { name: string }, Error|void>}
 * @extends {Query<"query-1", { name: string }, Error|void>}
 */
const Query1 = class extends Query
{
	constructor()
	{
		super("query-1", "SELECT");
	}
 	/** @type {IQuery<"query-1", { name: string }, Error|void>["run"]}*/
	run(pool, input)
	{
		return void 0;
	}
}


/**
 * @class
 * @implements {IQuery<"query-2", { name2: string }, number>}
 * @extends {Query<"query-2", { name2: string }, number>}
 */
const Query2 = class extends Query
{
	constructor()
	{
		super("query-2", "SELECT");
	}
 	/** @type {IQuery<"query-2", { name2: string }, number>["run"]}*/
	async run(pool, input)
	{
		return 666;
	}
}

const db = new DB({
	db_host:"",
	db_name:"",
	db_port:1,
	db_user:"",
	db_password:""
}, new Query1(), new Query2());

db.exec("query-1", { name: "str" })
db.exec("query-2", { name2: "" })

