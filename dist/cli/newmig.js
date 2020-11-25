#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log('Pigmig: Creating new migration file...');
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var dirPath = process.argv[2];
var fileNamePart = process.argv[3];
if (!dirPath || !fileNamePart) {
    console.log('Pigmig: Error: Please provide a migration directory and a desired file name.');
    console.log('Pigmig: Example: npx pigmig.newmig src/db/migrations add_user_table');
    console.log('Pigmig: Exiting early. No new migration file has been created.');
    process.exit();
}
var timestamp = Date.now();
var fileName = timestamp + "." + fileNamePart + ".sql";
var filePath = path_1.default.resolve(dirPath, fileName);
fs_1.default.writeFileSync(filePath, '');
console.log("Pigmig: New migration file successfully created: " + filePath);
//# sourceMappingURL=newmig.js.map