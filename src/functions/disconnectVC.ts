import { VoiceConnection, VoiceConnectionStatus, entersState } from '@discordjs/voice';
import { vcPlayer } from './config.js';

export async function disconnectVC(connection: VoiceConnection): Promise<void> {
    const channel = connection.joinConfig.channelId;
    if (!channel) {
        throw new Error('The voice connection is not associated with a valid channel.');
    }

    try {
        console.debug(`Attempting to disconnect from voice channel: ${channel}`);
        connection.disconnect();
        await entersState(connection, VoiceConnectionStatus.Disconnected, 5_000);
    } catch (error) {
        console.error(`Error while trying to disconnect from voice channel: ${channel}`, error);
        throw error;
    } finally {
        vcPlayer.delete(connection.joinConfig.guildId);
        connection.destroy();
        console.debug(`Voice connection destroyed for guild: ${channel}`);
    }
}
