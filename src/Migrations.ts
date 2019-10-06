import { MigrationTable } from './MigrationTable'
import { MigrationDir } from './MigrationDir'
import { Migration } from './Migration'

export class Migrations {
  migTable: MigrationTable
  migDir: MigrationDir
  constructor(dirPath: string) {
    this.migTable = new MigrationTable()
    this.migDir = new MigrationDir(dirPath)
  }

  private verifyChecksums(dirMigs: Migration[], tableMigs: Migration[]) {
    const equals = (mig1: Migration) => (mig2: Migration) => mig1.isEqualTo(mig2)
    const isSomeDirMig = (mig: Migration) => dirMigs.some(equals(mig))
    const verified: boolean = tableMigs.every(isSomeDirMig)
    if (!verified) throw new Error('Pigmig: Migration checksum validation failed.')
  }

  private async getNewMigrations() {
    await this.migTable.connect()
    await this.migTable.createTableIfNotExist()
    const dirMigs = this.migDir.getMigrations()
    const tableMigs = await this.migTable.getMigrations()
    this.verifyChecksums(dirMigs, tableMigs)
    const oldChecksums = tableMigs.map(oldMig => oldMig.checksum)
    return dirMigs.filter(({ checksum }) => !oldChecksums.includes(checksum))
  }

  async runNewMigrations() {
    const newMigs = await this.getNewMigrations()
    await this.migTable.runMigrations(newMigs)
    await this.migTable.end()
  }
}
