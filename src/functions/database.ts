import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';

const DB_PATH = process.env.DB_PATH ?? 'data/vox-talk.db';
mkdirSync(dirname(DB_PATH), { recursive: true }); // 初回は data/ が無いので作成

export const db = new Database(DB_PATH);

export function initDB() {
    // server settings table
    db.exec(`
        CREATE TABLE IF NOT EXISTS server_settings (
        guild_id TEXT PRIMARY KEY NOT NULL,
        volume INTEGER NOT NULL,
        auto_connect BOOLEAN NOT NULL,
        auto_disconnect BOOLEAN NOT NULL,
        join_leave_notification BOOLEAN NOT NULL
        );
    `);

    // user settings table
    db.exec(`
        CREATE TABLE IF NOT EXISTS user_settings (
        user_id TEXT PRIMARY KEY NOT NULL,
        speaker TEXT NOT NULL,
        settings TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(settings))
        );
    `);

    // auto join table
    db.exec(`
        CREATE TABLE IF NOT EXISTS auto_join (
        guild_id       TEXT NOT NULL,
        vc_channel_id  TEXT NOT NULL,
        tts_channel_id TEXT NOT NULL,
        PRIMARY KEY (guild_id, vc_channel_id),
        FOREIGN KEY (guild_id) REFERENCES server_settings(guild_id) ON DELETE CASCADE
        );
    `);

    // dictionary table
    db.exec(`
        CREATE TABLE IF NOT EXISTS dictionary (
        key   TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
        );
    `);
}
