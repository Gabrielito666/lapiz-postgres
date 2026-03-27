/**
 * @file
 * @source ./lib/query/index.js
 * @module lapiz-postgres/query
 * @description This module implements the database queries
 */
const {DatabaseError} = require("pg");
/**
 * @import {PoolClient, Pool, QueryResult} from "pg"
 */

/**
 * @template {string}Name
 * @template Input
 * @template Output
 * @typedef {{
 *	name: Name;
 *	run(pool: Pool|PoolClient, input: Input):Output
 * }} IQuery
 */

/**
 * Undefined to null helper
 * @template T
 * @typedef {{
 *	[K in keyof T]-?: undefined extends T[K]
 *		? Exclude<T[K], undefined> | null
 *		: T[K];
 * }} UndefinedToNull
 */

/**
 * @class
 * @template {string}Name
 * @template Input
 * @template Output
 * @abstract
 * @implements {IQuery<Name, Input, Output>}
 */
const Query = class
{
	/**
	 * @template {Object}T
	 * @param {T} obj
	 * @returns {UndefinedToNull<T>}
	 */
	static undefToNull(obj)
	{
		return Object.entries(obj).reduce((acc, [key, value]) => ({
			...acc,
			[key]: value === undefined ? null : value
		}), /**@type {UndefinedToNull<T>}*/({}));
	}
	/**
	 * @param {string} constraint
	 * @returns {string|null}
	 */
	static constraintToColumnName(constraint)
	{
		const match = constraint.match(/^[^_]+_(.+)_key$/);
  		return match ? match[1] : null;
	}
	/**
	 * @param {Name} name
	 * @param {string} queryStr
	 */
	constructor(name, queryStr)
	{
		/**@type {Name} @constant @readonly*/
		this.name = name;
		/**@type {string} @constant @readonly @private*/
		this.query = queryStr;
	}
	/**
	 * Use this method if you know that a database error is not expected,
	 * for example in an update without constraints involved, etc.
	 * @protected
	 * @param {Pool|PoolClient} executor
	 * @param {Array<any>} params
	 * @returns {Promise<QueryResult<any>>}
	 */
	rawCall(executor, params)
	{
		return executor.query({ name: this.name, text: this.query, values: params });
	}
	/**
	 * Use this method if you expect a database error,
	 * for example in an update with constraints and possible conflicts.
	 * @protected
	 * @param {Pool|PoolClient} executor
	 * @param {Array<any>} params
	 * @returns {Promise<{
	 * 	result: QueryResult<any>;
	 * 	database_error: null;
	 * 	unexpected_error: null;
	 * }|{
	 * 	result: null;
	 * 	database_error: DatabaseError;
	 * 	unexpected_error: null;
	 * }|{
	 *	result: null;
	 *	database_error: null;
	 *	unexpected_error: Error;
	 * }>}
	 */
	async safeRawCall(executor, params)
	{
		return executor.query({ name: this.name, text: this.query, values: params })
		.then(result =>
		{
			return { result, database_error: null, unexpected_error: null };
		})
		.catch(err =>
		{
			if(err instanceof DatabaseError)
			{
				return { result: null, database_error: err, unexpected_error: null };
			}

			return {
				result: null,
				database_error: null,
				unexpected_error: err instanceof Error ? err : new Error("[lapiz-postgres Error]: unexpected error in pool.query: " +  (err.message || ""))
			}
		})
	}
	/**
	 * @type {IQuery<string, Input, Output>["run"]}
	 */
	async run(executor, input)
	{
		throw new Error("[lapiz-postgres DB ERROR]: all Query must implements .run() method");
	}
}

module.exports = Query;
