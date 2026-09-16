import { Client, Events, GatewayIntentBits } from 'discord.js';

const client: Client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

// Load commands

// Load events

client.login(process.env.DISCORD_BOT_TOKEN);

client.once(Events.ClientReady, (readyClient) => {
    console.log(`Ready! Logged in as ${readyClient.user.tag}`);
    readyClient.user.setActivity({
        name: 'Vox Talk',
        type: 0, // 0 = Playing, 1 = Streaming, 2 = Listening, 3 = Watching, 5 = Competing
    });
});
