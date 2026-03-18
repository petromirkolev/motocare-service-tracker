"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runQuery = runQuery;
exports.getOne = getOne;
exports.getAll = getAll;
const db_1 = require("./db");
function runQuery(sql, params = []) {
    return new Promise((resolve, reject) => {
        db_1.db.run(sql, params, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}
function getOne(sql, params = []) {
    return new Promise((resolve, reject) => {
        db_1.db.get(sql, params, (err, row) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(row);
        });
    });
}
function getAll(sql, params = []) {
    return new Promise((resolve, reject) => {
        db_1.db.all(sql, params, (err, rows) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(rows);
        });
    });
}
