import { MessageMentions, MessageType, type Message } from 'discord.js';

export async function parseDiscordMsg(message: Message): Promise<string> {
    let text = message.content;

    // replyの場合、返信先のユーザー名を取得してテキストに追加
    if (message.type == MessageType.Reply && message.reference) {
        try {
            const targetMessage = await message.fetchReference();
            const targetUser = targetMessage.member?.displayName ?? targetMessage.author.username;
            text = `${targetUser}への返信: ${text}`;
        } catch {
            text = `不明なユーザーへの返信: ${text}`;
        }
    }

    // メンションをユーザー名に置換
    text = text.replace(new RegExp(MessageMentions.UsersPattern.source, 'g'), (match, userId) => {
        const user = message.guild?.members.cache.get(userId);
        if (user) {
            return `${user.displayName}へのメンション`;
        } else {
            return `不明なユーザーへのメンション`;
        }
    });

    // ロールメンションをロール名に置換
    text = text.replace(new RegExp(MessageMentions.RolesPattern.source, 'g'), (match, roleId) => {
        const role = message.guild?.roles.cache.get(roleId);
        if (role) {
            return `${role.name}へのメンション`;
        } else {
            return `不明なロールへのメンション`;
        }
    });

    // everoneメンションを置換
    text = text.replace(new RegExp(MessageMentions.EveryonePattern.source, 'g'), 'みんなへのメンション');

    // チャンネルリンクを置換
    text = text.replace(new RegExp(MessageMentions.ChannelsPattern.source, 'g'), (match, channelId) => {
        const channel = message.guild?.channels.cache.get(channelId);
        if (channel) {
            return `${channel.name}へのリンク`;
        } else {
            return `不明なチャンネルへのリンク`;
        }
    });

    // カスタムemojiを置換
    text = text.replace(/<a?:([A-Za-z0-9_]+):\d+>/g, '$1');

    // スタンプ名を追加
    if (message.stickers.size > 0) {
        const sticker = message.stickers.first();
        text += `${sticker?.name}のスタンプ`;
    }

    // 添付ファイルがあれば追加
    if (message.attachments.size > 0) {
        text += '添付ファイルが送信されました';
    }

    return text.trim();
}
