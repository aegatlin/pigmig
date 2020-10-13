"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration = void 0;
var fs_1 = require("fs");
var path_1 = require("path");
var crypto_1 = require("crypto");
var Migration = /** @class */ (function () {
    function Migration(fileName, sql, checksum, id) {
        this.fileName = fileName;
        this.sql = sql;
        this.checksum = checksum;
        this.id = id;
    }
    Migration.fromFile = function (migDir, fileName) {
        var sql = fs_1.readFileSync(path_1.resolve(migDir, fileName), 'utf8');
        var checksum = Migration.generateChecksum("" + fileName + sql);
        return new Migration(fileName, sql, checksum);
    };
    Migration.fromTable = function (tableMigs) {
        return tableMigs.map(function (_a) {
            var id = _a.id, file_name = _a.file_name, sql = _a.sql, checksum = _a.checksum;
            var fileName = file_name;
            return new Migration(fileName, sql, checksum, id);
        });
    };
    Migration.generateChecksum = function (text) {
        return crypto_1.createHash('sha256')
            .update(text)
            .digest('base64');
    };
    Migration.prototype.isEqualTo = function (_a) {
        var fileName = _a.fileName, sql = _a.sql, checksum = _a.checksum;
        if (this.fileName !== fileName)
            return false;
        if (this.sql !== sql)
            return false;
        if (this.checksum !== checksum)
            return false;
        return true;
    };
    return Migration;
}());
exports.Migration = Migration;
