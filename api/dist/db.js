"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const sqlite3_1 = __importDefault(require("sqlite3"));
const DB_PATH = process.env.DB_PATH || './data/motocarejobs.sqlite';
const DB_DIR = path_1.default.dirname(DB_PATH);
if (!fs_1.default.existsSync(DB_DIR)) {
    fs_1.default.mkdirSync(DB_DIR, { recursive: true });
}
exports.db = new sqlite3_1.default.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Failed to connect to SQLite:', err.message);
        return;
    }
    exports.db.run(`CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
      )
    `, (tableErr) => {
        if (tableErr) {
            console.error('Failed to create users table:', tableErr.message);
            return;
        }
    });
    exports.db.run(`CREATE TABLE IF NOT EXISTS bikes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      make TEXT NOT NULL,
      model TEXT NOT NULL,
      year INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id))
      `, (tableErr) => {
        if (tableErr) {
            console.error('Failed to create bikes table:', tableErr.message);
            return;
        }
    });
    exports.db.run(`CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    bike_id TEXT NOT NULL,
    service_type TEXT NOT NULL,
    odometer INTEGER NOT NULL,
    note TEXT,
    status TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (bike_id) REFERENCES bikes(id)
  )`, (tableErr) => {
        if (tableErr) {
            console.error('Failed to create jobs table:', tableErr.message);
            return;
        }
    });
});
