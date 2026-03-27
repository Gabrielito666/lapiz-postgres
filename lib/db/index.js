/**
 * @file
 * @source ./lib/db/index.js
 * @module lapiz-postgres/db
 * @description This module implements doglock database
 */

const { Pool } = require("pg");

/**
 * @import {IQuery} from "#lib/query/index.js"
 */

/**
 * @template {IQuery<any, any, any>[]}Q
 * @typedef {Q[number]["name"]} QueriesNames
 */
/**
 * @template {IQuery<any, any, any>[]}Q
 * @template {Q[number]["name"]}QName
 * @typedef {Extract<Q[number], { name: QName }>} QueryByName
 */
/**
 * @template {IQuery<any, any, any>[]}Q
 * @typedef {{ [K in QueriesNames<Q>]: QueryByName<Q, K> }} QueriesMap
 */
/**
 * @template {IQuery<any, any, any>[]}Q
 * @template {Q[number]["name"]}QName
 * @typedef {Parameters<QueryByName<Q, QName>["run"]>[1]} QueryInputByName
 */
/**
 * @template {IQuery<any, any, any>[]}Q
 * @template {Q[number]["name"]}QName
 * @typedef {ReturnType<QueryByName<Q, QName>["run"]>} QueryOutputByName
 */

/**
 * @template {IQuery<any, any, any>[]}Q
 * @class
 */
const DB = class
{
	/**
	 * @param {Object} dbParams
	 * @param {string} dbParams.db_host
	 * @param {number} dbParams.db_port
	 * @param {string} dbParams.db_user
	 * @param {string} dbParams.db_password
	 * @param {string} dbParams.db_name
	 * @param {Q} queriesList
	 */
	constructor({ db_host, db_port, db_user, db_password, db_name }, ...queriesList)
	{
		/**
		 * @constant
		 * @readonly
		 * @type {Pool}
		 */
		this.pool = new Pool({
			host: db_host,
			port: db_port,
			user: db_user,
			password: db_password,
			database: db_name
		})

		/**
		 * @type {QueriesMap<Q>}
		 */
		this.queries = queriesList
			.reduce((acc, q) => ({ ...acc, [q.name]: q }), /**@type{QueriesMap<Q>}*/({}));
	}

	/**
	 * @template {QueriesNames<Q>}QName
	 * @param {QName} queryName
	 * @param {QueryInputByName<Q, QName>} queryInput
	 * @returns {QueryOutputByName<Q, QName>}
	 */
	exec(queryName, queryInput)
	{
		const query = this.queries[queryName];
		const output = query.run(this.pool, queryInput);
		
		return output;
	}
}
module.exports = DB;
