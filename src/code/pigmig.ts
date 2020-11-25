import path from 'path'
import fs from 'fs'
import crypto from 'crypto'
import { Client } from 'pg'
import { eor } from 'eor'

export type Migration = {
  fileName: string
  sql: string
  checksum: string
}

const dbClient = new Client({ connectionString: process.env.DATABASE_URL })

export const migrate = async (dirPath: string) => {
  console.log('Pigmig: Pigmig initiated...')
  ensureDirPath(dirPath)
  const fileMigs: Migration[] = getFileMigs(dirPath)

  console.log('Pigmig: Checking for new migrations...')
  await dbClient.connect()
  dbClient.on('error', (e) => fail(`DB Client Connection error: ${e}`))
  await ensureMigTable(dbClient)
  const dbMigs: Migration[] = await getDbMigs(dbClient)
  verifyChecksums(dbMigs, fileMigs)
  const newMigs = getNewMigs(dbMigs, fileMigs)
  if (newMigs.length < 1) {
    console.log('Pigmig: No new migrations detected.')
  } else {
    console.log('Pigmig: New migrations detected.')
    console.log('Pigmig: Running new migrations...')
    await runNewMigs(dbClient, newMigs)
  }
  await dbClient.end()
  console.log('Pigmig: Pigmig complete.')
}

const runNewMigs = async (dbClient: Client, newMigs: Migration[]) => {
  for (const { fileName, sql, checksum } of newMigs) {
    const [e] = await eor(dbClient.query(sql))
    if (e) fail(`Failed to execute sql for ${fileName}: ${e}`)
    console.log(`Pigmig: Migration successful for ${fileName}`)

    const [err] = await eor(
      dbClient.query(
        'INSERT INTO migrations (file_name, sql, checksum) VALUES ($1, $2, $3);',
        [fileName, sql, checksum]
      )
    )
    if (err) fail(`Failed to update migration table for ${fileName}: ${err}`)
  }
}

export const getNewMigs = (dbMigs: Migration[], fileMigs: Migration[]) => {
  return fileMigs.filter(
    (fileMig) => !dbMigs.some((dbMig) => fileMig.checksum == dbMig.checksum)
  )
}

export const verifyChecksums = (dbMigs: Migration[], fileMigs: Migration[]) => {
  dbMigs.forEach((dbMig) => {
    const fileMig = fileMigs.find(
      (fileMig) => dbMig.checksum === fileMig.checksum
    )

    if (
      !fileMig ||
      dbMig.sql !== fileMig.sql ||
      dbMig.fileName !== fileMig.fileName
    ) {
      fail(`Checksum verification failed for ${dbMig.fileName}.`)
    }
  })
}

const ensureDirPath = (dirPath: string) => {
  if (!fs.existsSync(dirPath)) fail('Migration directory does not exist!')
}

const getFileMigs = (dirPath: string): Migration[] => {
  const fileNames: string[] = fs.readdirSync(dirPath)
  return fileNames.map((fileName: string) => {
    const sql = fs.readFileSync(path.resolve(dirPath, fileName), 'utf8')
    const checksum = generateChecksum(`${fileName}${sql}`)
    return { fileName, sql, checksum }
  })
}

const CREATE_MIGRATION_TABLE = `
CREATE TABLE IF NOT EXISTS migrations (
  id SERIAL PRIMARY KEY,
  file_name TEXT UNIQUE NOT NULL,
  sql TEXT NOT NULL,
  checksum TEXT UNIQUE NOT NULL
);`
const ensureMigTable = async (dbClient: Client) => {
  const [e] = await eor(dbClient.query(CREATE_MIGRATION_TABLE))
  if (e) fail(e)
}

type MigrationRow = {
  file_name: string
  sql: string
  checksum: string
}

const getDbMigs = async (dbClient: Client): Promise<Migration[]> => {
  const [e, result] = await eor(
    dbClient.query<MigrationRow>(
      'SELECT file_name, sql, checksum FROM migrations;'
    )
  )
  if (e) fail(e)
  return result.rows.map(({ file_name, sql, checksum }) => ({
    fileName: file_name,
    sql,
    checksum,
  }))
}

const generateChecksum = (text: string) => {
  return crypto.createHash('sha256').update(text).digest('base64')
}

const fail = (error: Error | string = '') => {
  throw new Error(`Pigmig: Error: ${error}`)
}

export default { migrate }
