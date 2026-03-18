"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createJob = createJob;
exports.findJobById = findJobById;
exports.listJobsByUserId = listJobsByUserId;
exports.updateJobStatus = updateJobStatus;
exports.deleteJob = deleteJob;
const uuid_1 = require("uuid");
const db_helpers_1 = require("../db-helpers");
async function createJob(params) {
    const now = new Date().toISOString();
    await (0, db_helpers_1.runQuery)(`
      INSERT INTO jobs (id, user_id, bike_id, service_type, odometer, note, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
        (0, uuid_1.v4)(),
        params.user_id,
        params.bike_id,
        params.service_type,
        params.odometer,
        params.note,
        'requested',
        now,
        now,
    ]);
}
async function findJobById(id) {
    return (0, db_helpers_1.getOne)('SELECT * FROM jobs WHERE id = ?', [id]);
}
async function listJobsByUserId(user_id) {
    return (0, db_helpers_1.getAll)('SELECT * FROM jobs WHERE user_id = ? ORDER BY created_at DESC', [user_id]);
}
async function updateJobStatus(params) {
    await (0, db_helpers_1.runQuery)(`
      UPDATE jobs
      SET status = ?, updated_at = ?
      WHERE id = ? AND user_id = ?
    `, [params.status, new Date().toISOString(), params.id, params.user_id]);
}
async function deleteJob(params) {
    await (0, db_helpers_1.runQuery)(`
      DELETE FROM jobs
      WHERE id = ? AND user_id = ?
    `, [params.id, params.user_id]);
}
