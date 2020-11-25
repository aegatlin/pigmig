"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyChecksums = exports.getNewMigs = exports.migrate = void 0;
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var crypto_1 = __importDefault(require("crypto"));
var pg_1 = require("pg");
var eor_1 = require("eor");
var dbClient = new pg_1.Client({ connectionString: process.env.DATABASE_URL });
var migrate = function (dirPath) { return __awaiter(void 0, void 0, void 0, function () {
    var fileMigs, dbMigs, newMigs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log('Pigmig: Pigmig initiated...');
                ensureDirPath(dirPath);
                fileMigs = getFileMigs(dirPath);
                console.log('Pigmig: Checking for new migrations...');
                return [4 /*yield*/, dbClient.connect()];
            case 1:
                _a.sent();
                dbClient.on('error', function (e) { return fail("DB Client Connection error: " + e); });
                return [4 /*yield*/, ensureMigTable(dbClient)];
            case 2:
                _a.sent();
                return [4 /*yield*/, getDbMigs(dbClient)];
            case 3:
                dbMigs = _a.sent();
                exports.verifyChecksums(dbMigs, fileMigs);
                newMigs = exports.getNewMigs(dbMigs, fileMigs);
                if (!(newMigs.length < 1)) return [3 /*break*/, 4];
                console.log('Pigmig: No new migrations detected.');
                return [3 /*break*/, 6];
            case 4:
                console.log('Pigmig: New migrations detected.');
                console.log('Pigmig: Running new migrations...');
                return [4 /*yield*/, runNewMigs(dbClient, newMigs)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [4 /*yield*/, dbClient.end()];
            case 7:
                _a.sent();
                console.log('Pigmig: Pigmig complete.');
                return [2 /*return*/];
        }
    });
}); };
exports.migrate = migrate;
var runNewMigs = function (dbClient, newMigs) { return __awaiter(void 0, void 0, void 0, function () {
    var _i, newMigs_1, _a, fileName, sql, checksum, e, err;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _i = 0, newMigs_1 = newMigs;
                _b.label = 1;
            case 1:
                if (!(_i < newMigs_1.length)) return [3 /*break*/, 5];
                _a = newMigs_1[_i], fileName = _a.fileName, sql = _a.sql, checksum = _a.checksum;
                return [4 /*yield*/, eor_1.eor(dbClient.query(sql))];
            case 2:
                e = (_b.sent())[0];
                if (e)
                    fail("Failed to execute sql for " + fileName + ": " + e);
                console.log("Pigmig: Migration successful for " + fileName);
                return [4 /*yield*/, eor_1.eor(dbClient.query('INSERT INTO migrations (file_name, sql, checksum) VALUES ($1, $2, $3);', [fileName, sql, checksum]))];
            case 3:
                err = (_b.sent())[0];
                if (err)
                    fail("Failed to update migration table for " + fileName + ": " + err);
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/];
        }
    });
}); };
var getNewMigs = function (dbMigs, fileMigs) {
    return fileMigs.filter(function (fileMig) { return !dbMigs.some(function (dbMig) { return fileMig.checksum == dbMig.checksum; }); });
};
exports.getNewMigs = getNewMigs;
var verifyChecksums = function (dbMigs, fileMigs) {
    dbMigs.forEach(function (dbMig) {
        var fileMig = fileMigs.find(function (fileMig) { return dbMig.checksum === fileMig.checksum; });
        if (!fileMig ||
            dbMig.sql !== fileMig.sql ||
            dbMig.fileName !== fileMig.fileName) {
            fail("Checksum verification failed for " + dbMig.fileName + ".");
        }
    });
};
exports.verifyChecksums = verifyChecksums;
var ensureDirPath = function (dirPath) {
    if (!fs_1.default.existsSync(dirPath))
        fail('Migration directory does not exist!');
};
var getFileMigs = function (dirPath) {
    var fileNames = fs_1.default.readdirSync(dirPath);
    return fileNames.map(function (fileName) {
        var sql = fs_1.default.readFileSync(path_1.default.resolve(dirPath, fileName), 'utf8');
        var checksum = generateChecksum("" + fileName + sql);
        return { fileName: fileName, sql: sql, checksum: checksum };
    });
};
var CREATE_MIGRATION_TABLE = "\nCREATE TABLE IF NOT EXISTS migrations (\n  id SERIAL PRIMARY KEY,\n  file_name TEXT UNIQUE NOT NULL,\n  sql TEXT NOT NULL,\n  checksum TEXT UNIQUE NOT NULL\n);";
var ensureMigTable = function (dbClient) { return __awaiter(void 0, void 0, void 0, function () {
    var e;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, eor_1.eor(dbClient.query(CREATE_MIGRATION_TABLE))];
            case 1:
                e = (_a.sent())[0];
                if (e)
                    fail(e);
                return [2 /*return*/];
        }
    });
}); };
var getDbMigs = function (dbClient) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, e, result;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, eor_1.eor(dbClient.query('SELECT file_name, sql, checksum FROM migrations;'))];
            case 1:
                _a = _b.sent(), e = _a[0], result = _a[1];
                if (e)
                    fail(e);
                return [2 /*return*/, result.rows.map(function (_a) {
                        var file_name = _a.file_name, sql = _a.sql, checksum = _a.checksum;
                        return ({
                            fileName: file_name,
                            sql: sql,
                            checksum: checksum,
                        });
                    })];
        }
    });
}); };
var generateChecksum = function (text) {
    return crypto_1.default.createHash('sha256').update(text).digest('base64');
};
var fail = function (error) {
    if (error === void 0) { error = ''; }
    throw new Error("Pigmig: Error: " + error);
};
exports.default = { migrate: exports.migrate };
//# sourceMappingURL=pigmig.js.map