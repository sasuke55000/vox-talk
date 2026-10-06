import type { Collection } from 'discord.js';
declare module 'discord.js' {
    interface Client {
        commands: Collection<string, commandModule>;
        cooldowns: Collection<string, number>;
    }
}
