import { Events, Client } from 'discord.js';
import { connectVC } from '../functions/connectVC.js';

export default {
    name: Events.ClientReady,
    once: true,
    execute(readyClient: Client<true>) {
        console.log(`Ready! Logged in as ${readyClient.user.tag}`);
        readyClient.user.setActivity({
            name: 'Vox Talk',
            type: 0, // 0 = Playing, 1 = Streaming, 2 = Listening, 3 = Watching, 5 = Competing
        });

        for (const guild of readyClient.guilds.cache.values()) {
            console.log(`Bot is in guild: ${guild.name} (ID: ${guild.id})`);

            // Attempt to connect to the voice channel the bot is currently in, if any
            const channel = guild.members.me?.voice.channel;
            if (channel) {
                connectVC(channel)
                    .then(() => {
                        console.log(`Bot connected to voice channel: ${channel.name}`);
                    })
                    .catch((error) => {
                        console.error(`Failed to connect to voice channel: ${channel.name}`, error);
                    });
            }
        }
    },
};
