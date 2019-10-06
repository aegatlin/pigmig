interface TableMigration {
    id: number;
    file_name: string;
    sql: string;
    checksum: string;
}
export declare class Migration {
    readonly fileName: string;
    readonly sql: string;
    readonly checksum: string;
    readonly id?: number;
    static fromFile(migDir: string, fileName: string): Migration;
    static fromTable(tableMigs: TableMigration[]): Migration[];
    private static generateChecksum;
    private constructor();
    isEqualTo({ fileName, sql, checksum }: Migration): boolean;
}
export {};
