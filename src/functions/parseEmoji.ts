import emojiRegex from 'emoji-regex';
import emojiData from 'emojibase-data/ja/data.json' with { type: 'json' };

const normalizeEmoji = (emoji: string) => emoji.replace(/[\uFE0E\uFE0F]/g, '');
const regex = emojiRegex();

// const emojiMap = new Map(emojiData.map((e) => [normalizeEmoji(e.emoji), e.label]));
const emojiMap = new Map(
    emojiData.flatMap((emoji) => [
        [normalizeEmoji(emoji.emoji), emoji.label] as const,
        ...(emoji.skins?.map((skin) => [normalizeEmoji(skin.emoji), skin.label] as const) ?? []),
    ]),
);

export function parseEmoji(message: string): string {
    console.log('Parsing emojis in text:', message);
    message = message.replace(/[\uFE0E\uFE0F]/g, '');
    return message.replace(regex, (emoji) => emojiMap.get(emoji) ?? emoji);
}
