#! /usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var pigmig_1 = __importDefault(require("../code/pigmig"));
var dirPath = process.argv[2];
if (!dirPath) {
    console.log('Pigmig: Error: Please provide your migrations directory path.');
    console.log('Pigmig: Example: npx pigmig.migrate src/db/migrations');
    console.log('Pigmig: Exiting early. No migrations were ran.');
    process.exit();
}
pigmig_1.default.migrate(dirPath);
//# sourceMappingURL=migrate.js.map