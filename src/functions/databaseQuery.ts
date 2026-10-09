import { db } from './database.js';

export function getServerSettings(guildId: string): unknown {
    return db
        .prepare(
            `
        SELECT * FROM server_settings WHERE guild_id = ?
    `,
        )
        .get(guildId);
}

export function updateServerSettings(
    guildId: string,
    volume: number,
    autoConnect: boolean,
    autoDisconnect: boolean,
    joinLeaveNotification: boolean,
): boolean {
    const result = db
        .prepare(
            `
        INSERT INTO server_settings (guild_id, volume, auto_connect, auto_disconnect, join_leave_notification)
        VALUES (?, ?, ?, ?, ?)
        ON CONFLICT(guild_id) DO UPDATE SET
            volume = excluded.volume,
            auto_connect = excluded.auto_connect,
            auto_disconnect = excluded.auto_disconnect,
            join_leave_notification = excluded.join_leave_notification
        `,
        )
        .run(guildId, volume, autoConnect, autoDisconnect, joinLeaveNotification);

    if (result.changes === 1) {
        return true;
    } else {
        return false;
    }
}

export function getUserSettings(userId: string): unknown {
    return db
        .prepare(
            `
        SELECT * FROM user_settings WHERE user_id = ?
    `,
        )
        .get(userId);
}

export function updateUserSettings(userId: string, speaker: string, settings: string): boolean {
    const result = db
        .prepare(
            `
        INSERT INTO user_settings (user_id, speaker, settings)
        VALUES (?, ?, ?)
        ON CONFLICT(user_id) DO UPDATE SET
            speaker = excluded.speaker,
            settings = excluded.settings
        `,
        )
        .run(userId, speaker, settings);

    if (result.changes === 1) {
        return true;
    } else {
        return false;
    }
}

export function getAutoJoinSettings(guildId: string): unknown {
    return db
        .prepare(
            `
        SELECT vc_channel_id, tts_channel_id FROM auto_join WHERE guild_id = ?
    `,
        )
        .get(guildId);
}

export function updateAutoJoinSettings(guildId: string, vcChannelId: string, ttsChannelId: string): boolean {
    const result = db
        .prepare(
            `
        INSERT INTO auto_join (guild_id, vc_channel_id, tts_channel_id)
        VALUES (?, ?, ?)
        ON CONFLICT(guild_id, vc_channel_id) DO UPDATE SET
            tts_channel_id = excluded.tts_channel_id
        `,
        )
        .run(guildId, vcChannelId, ttsChannelId);

    if (result.changes === 1) {
        return true;
    } else {
        return false;
    }
}

export function getDictionary(): unknown {
    return db
        .prepare(
            `
        SELECT * FROM dictionary
    `,
        )
        .all();
}

export function updateDictionary(key: string, value: string): boolean {
    const result = db
        .prepare(
            `
        INSERT INTO dictionary (key, value)
        VALUES (?, ?)
        ON CONFLICT(key) DO UPDATE SET
            value = excluded.value
        `,
        )
        .run(key, value);

    if (result.changes === 1) {
        return true;
    } else {
        return false;
    }
}
