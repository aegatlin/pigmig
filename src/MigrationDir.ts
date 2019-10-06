import { resolve } from 'path'
import { eor } from 'eor'
import { readdirSync } from 'fs'
import { Migration } from './Migration'
import { log } from '.'

export class MigrationDir {
  constructor(readonly dirPath: string) {}

  getMigrations(): Migration[] {
    const [e, migFiles] = eor<string[]>(readdirSync, resolve(this.dirPath))
    if (e) return log(e)
    return migFiles.map(fileName => Migration.fromFile(this.dirPath, fileName))
  }
}
