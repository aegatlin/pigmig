"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var eor_1 = require("eor");
var fs_1 = require("fs");
var Migration_1 = require("./Migration");
var _1 = require(".");
var MigrationDir = /** @class */ (function () {
    function MigrationDir(dirPath) {
        this.dirPath = dirPath;
    }
    MigrationDir.prototype.getMigrations = function () {
        var _this = this;
        var _a = eor_1.eor(fs_1.readdirSync, path_1.resolve(this.dirPath)), e = _a[0], migFiles = _a[1];
        if (e)
            return _1.log(e);
        return migFiles.map(function (fileName) { return Migration_1.Migration.fromFile(_this.dirPath, fileName); });
    };
    return MigrationDir;
}());
exports.MigrationDir = MigrationDir;
