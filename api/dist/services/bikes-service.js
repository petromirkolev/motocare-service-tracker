"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBike = createBike;
exports.findBikeById = findBikeById;
exports.listBikesByUserId = listBikesByUserId;
exports.deleteBike = deleteBike;
const uuid_1 = require("uuid");
const db_helpers_1 = require("../db-helpers");
async function createBike(params) {
    await (0, db_helpers_1.runQuery)(`
      INSERT INTO bikes (id, user_id, make, model, year, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [
        (0, uuid_1.v4)(),
        params.user_id,
        params.make,
        params.model,
        params.year,
        new Date().toISOString(),
    ]);
}
async function findBikeById(id) {
    return (0, db_helpers_1.getOne)('SELECT * FROM bikes WHERE id = ?', [id]);
}
async function listBikesByUserId(user_id) {
    return (0, db_helpers_1.getAll)('SELECT * FROM bikes WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
}
async function deleteBike(params) {
    await (0, db_helpers_1.runQuery)(`
      DELETE FROM bikes
      WHERE id = ? AND user_id = ?
    `, [params.id, params.user_id]);
}
