import { Client } from 'pg';
import { Migration } from './Migration';
export declare class MigrationTable {
    readonly client: Client;
    constructor();
    connect(): Promise<void>;
    end(): Promise<void>;
    createTableIfNotExist(): Promise<void>;
    getMigrations(): Promise<Migration[]>;
    runMigrations(migs: Migration[]): Promise<void>;
}
