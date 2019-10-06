import { MigrationTable } from './MigrationTable';
import { MigrationDir } from './MigrationDir';
export declare class Migrations {
    migTable: MigrationTable;
    migDir: MigrationDir;
    constructor(dirPath: string);
    private verifyChecksums;
    private getNewMigrations;
    runNewMigrations(): Promise<void>;
}
