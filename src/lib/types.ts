export type Song = {
    id: number;
    title: string;
    alternate_title: string;
    lyrics: string;
    verse_order: string;
    copyright: string;
    comments: string;
    ccli_number: string;
    theme_name: string;
    search_title: string;
    search_lyrics: string;
    create_date: Date;
    last_modified: Date;
    temporary: boolean;
}