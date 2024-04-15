interface ImageURL {
    url: string;
}

export type Content = Array<TextContent | ImageContent>

interface TextContent {
    type: 'text';
    text: string;
}

interface ImageContent {
    type: 'image_url';
    image_url: ImageURL;
}

export interface Message {
    role: string;
    content: string | Content;
    files?: string[] | undefined
}