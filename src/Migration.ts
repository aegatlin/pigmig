import { readFileSync } from 'fs'
import { resolve } from 'path'
import { createHash } from 'crypto'

interface TableMigration {
  id: number
  file_name: string
  sql: string,
  checksum: string
}

export class Migration {
  static fromFile(migDir: string, fileName: string): Migration {
    const sql = readFileSync(resolve(migDir, fileName), 'utf8')
    const checksum = Migration.generateChecksum(`${fileName}${sql}`)
    return new Migration(fileName, sql, checksum)
  }

  static fromTable(tableMigs: TableMigration[]): Migration[] {
    return tableMigs.map(({ id, file_name, sql, checksum }) => {
      const fileName = file_name
      return new Migration(fileName, sql, checksum, id)
    })
  }

  private static generateChecksum(text: string) {
    return createHash('sha256')
      .update(text)
      .digest('base64')
  }

  private constructor(
    readonly fileName: string,
    readonly sql: string,
    readonly checksum: string,
    readonly id?: number
  ) {}

  isEqualTo({ fileName, sql, checksum }: Migration): boolean {
    if (this.fileName !== fileName) return false
    if (this.sql !== sql) return false
    if (this.checksum !== checksum) return false
    return true
  }
}
