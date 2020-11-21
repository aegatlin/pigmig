import { Client } from 'pg'
import { Migration } from './Migration'
import { eor } from 'eor'
import { log } from '.'

export class MigrationTable {
  readonly client: Client = new Client({ connectionString: process.env.DATABASE_URL })

  constructor() {}

  async connect(): Promise<void> {
    const [e] = await eor(this.client.connect())
    if (e) log(e)
  }

  async end(): Promise<void> {
    const [e] = await eor(this.client.end())
    if (e) log(e)
  }

  async createTableIfNotExist(): Promise<void> {
    const CREATE = `
    CREATE TABLE IF NOT EXISTS migrations(
      id serial PRIMARY KEY,
      file_name text,
      sql text,
      checksum text
    );`
    const [e] = await eor(this.client.query(CREATE))
    if (e) log(e)
  }

  async getMigrations(): Promise<Migration[]> {
    const [e, result] = await eor(this.client.query(`SELECT * FROM migrations;`))
    if (e) return log(e)
    return Migration.fromTable(result.rows)
  }

  async runMigrations(migs: Migration[]): Promise<void> {
    const INSERT = `INSERT INTO migrations(file_name, sql, checksum) VALUES ($1, $2, $3);`
    for (let { fileName, sql, checksum } of migs) {
      const [e] = await eor(this.client.query(sql))
      if (e) log(e)
      const [err] = await eor(this.client.query(INSERT, [fileName, sql, checksum]))
      if (err) log(err)
      log(`Pigmig: Migration successful: ${fileName}`)
    }
  }
}
