import mysql from 'promise-mysql'
import { ErrorResponses } from './error-responses.mjs'

const ENV   = process.env,
      NULL  = null

class DatabaseOperations {

  constructor() {
    this.format = mysql.format
  }

  async executeQuery(query) {
    console.debug('executeQuery %s', query)

    if(!this._pool) {
      console.debug('Creating DB pool..')

      const pool = mysql.createPool({
        connectionLimit : 20,
        connectTimeout  : 20000,
        acquireTimeout  : 20000,
        host            : ENV.DB_HOST,
        port            : +ENV.DB_PORT,
        user            : ENV.DB_USER,
        password        : ENV.DB_PASSWORD,
        database        : ENV.DB_NAME
      })

      this._pool = await pool
    }

    try {
      const result = await this._pool.query(query)

      console.debug('Query result: %s', JSON.stringify(result))
      return result
    } catch(e) {
      console.error('Error executing db query %s', e)
      throw new Error(ErrorResponses.message.ERROR_EXECUTING_DB_QUERY)
    }
  }

  async close() {
    console.info('Closing db connection..')

    if(!this._pool) return
    await this._pool.end()
    this._pool = NULL
  }
}

const DB = new DatabaseOperations()
export { DB }
