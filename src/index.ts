import { Migrations } from './Migrations'
import { eor } from 'eor'

export function log(s: string): undefined
export function log(e: Error): undefined
export function log(sore: Error | string) {
  const isString = typeof sore === 'string'
  isString ? console.log(sore) : console.error(sore)
  return undefined
}

export const migrate = async (dirPath: string) => {
  const migrations = new Migrations(dirPath)
  const [e] = await eor(migrations.runNewMigrations())
  if (e) log(e)
}
