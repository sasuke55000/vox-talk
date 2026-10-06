export interface TtsCaller {
    readonly baseUrl: string;
    synthesize(text: string): Promise<Buffer>;
}