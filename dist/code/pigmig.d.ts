export declare type Migration = {
    fileName: string;
    sql: string;
    checksum: string;
};
export declare const migrate: (dirPath: string) => Promise<void>;
export declare const getNewMigs: (dbMigs: Migration[], fileMigs: Migration[]) => Migration[];
export declare const verifyChecksums: (dbMigs: Migration[], fileMigs: Migration[]) => void;
declare const _default: {
    migrate: (dirPath: string) => Promise<void>;
};
export default _default;
