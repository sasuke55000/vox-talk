export async function parseURL(text: string): Promise<string> {
    const urlMatch = text.match(/https?:\/\/[^\s]+/);
    if (!urlMatch) return text;
    for (const url of urlMatch) {
        const title = await getTitleFromURL(url);
        text = text.replace(url, title);
    }
    return text;
}

async function getTitleFromURL(url: string): Promise<string> {
    // URLをパースしてタイトルを取得する
    const response = await fetch(url);
    const html = await response.text();
    const match = html.match(/<title>(.*?)<\/title>/);
    let title: string;
    if (match && match?.[1]) {
        title = match[1].trim();
    } else {
        title = new URL(url).hostname;
        title = title.replace('.', 'ドット');
    }

    if (title.length > 20) {
        title = title.slice(0, 20) + '、以下略。';
    }

    return `『${title}』へのリンク`;
}
