import { ContentTypeEnum, Content } from '@/client';

export enum SortableContentType {
  Text = 'text',
  Files = 'files'
}

export abstract class SortableContent {
  id: string;
  type: SortableContentType;
  
  protected constructor(id: string, type: SortableContentType) {
    this.id = id;
    this.type = type;
  }
  
  abstract getData(): any;
}

export class SortableTextContent extends SortableContent {
  index: number;
  content: Content;
  
  constructor(index: number, content: Content) {
    super(`text-${index}`, SortableContentType.Text);
    this.index = index;
    this.content = content;
  }
  
  getData(): string {
    return this.content.data;
  }
}

export class SortableFileGroupContent extends SortableContent {
  fileItems: {
    index: number;
    content: Content;
  }[];
  
  constructor(fileItems: { index: number; content: Content }[]) {
    super(`file-group-${fileItems[0]?.index ?? 0}`, SortableContentType.Files);
    this.fileItems = fileItems;
  }
  
  getData(): string[] {
    return this.fileItems.map(fi => fi.content.data);
  }
  
  getIndices(): number[] {
    return this.fileItems.map(fi => fi.index);
  }
}

export function createSortableContents(contents: Content[]): SortableContent[] {
  const items: SortableContent[] = [];
  let currentFileGroup: { index: number; content: Content }[] = [];

  contents.forEach((content, index) => {
    if (content.type === ContentTypeEnum.File) {
      currentFileGroup.push({ index, content });
    } else {
      if (currentFileGroup.length > 0) {
        // Add the file group as one sortable item
        items.push(new SortableFileGroupContent(currentFileGroup));
        currentFileGroup = [];
      }

      // Add text content as individual item
      items.push(new SortableTextContent(index, content));
    }
  });

  // Add any remaining file group
  if (currentFileGroup.length > 0) {
    items.push(new SortableFileGroupContent(currentFileGroup));
  }

  return items;
} 