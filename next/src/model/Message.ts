interface ImageURL {
    url: string;
}

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
    content: string | Array<TextContent | ImageContent>;
}