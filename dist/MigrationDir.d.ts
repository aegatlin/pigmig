import { Migration } from './Migration';
export declare class MigrationDir {
    readonly dirPath: string;
    constructor(dirPath: string);
    getMigrations(): Migration[];
}
