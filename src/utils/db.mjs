import * as mysql from 'promise-mysql'

const ENV   = process.env,
      NULL  = null

class DatabaseOperations {

  constructor() {
    this.format = mysql.format
  }

  async executeQuery(query) {

    if(!this._pool) {
      console.debug('Creating DB pool')

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

      console.debug('executeQuery %s %s', query, JSON.stringify(result))
      return result
    } catch(e) {
      console.error('executeQuery error %s %s', query, e)
      throw new Error('Error occurred while executing DB query')
    }
  }

  async close() {
    console.info('Closing DB')

    if(!this._pool) return
    await this._pool.end()
    this._pool = NULL
  }
}

const DB = new DatabaseOperations()
export { DB }
