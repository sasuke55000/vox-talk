import { Events, type Message } from 'discord.js';
import { vcChannelId } from '../functions/config';
import { play } from '../functions/play';
import { getVoiceConnection } from '@discordjs/voice';
import { enqueuePlay } from '../functions/enqueuePlay.js';
import { parseDiscordMsg } from '../functions/parseDiscordMsg.js';
import { parseEmoji } from '../functions/parseEmoji.js';
import { parseURL } from '../functions/parseURL.js';

export default {
    name: Events.MessageCreate,
    async execute(message: Message) {
        if (message.author.bot) return;
        console.log(`channelId: ${message.channel.id}, guildId: ${message.guild?.id}`);
        console.log(`vcChannelId: ${vcChannelId.get(message.guild?.id || '')}`);
        if (message.channel.id !== vcChannelId.get(message.guild?.id || '')) return;

        console.log(`Message received from ${message.author.tag}: ${message.content}`);

        let text = await parseDiscordMsg(message);
        text = parseEmoji(text);
        text = await parseURL(text);

        try {
            await enqueuePlay(getVoiceConnection(message.guild?.id || ''), text);
        } catch (err) {
            console.error(`Error occurred while processing message: ${err}`);
            throw err;
        }
    },
};
