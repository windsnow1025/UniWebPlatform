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
  abstract getIndices(): number[];
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

  getIndices(): number[] {
    return [this.index];
  }
}

export class SortableFileGroupContent extends SortableContent {
  fileItems: { index: number; content: Content }[];

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
        items.push(new SortableFileGroupContent(currentFileGroup));
        currentFileGroup = [];
      }
      items.push(new SortableTextContent(index, content));
    }
  });

  if (currentFileGroup.length > 0) {
    items.push(new SortableFileGroupContent(currentFileGroup));
  }

  return items;
}

export function updateTextContent(
  contents: Content[],
  item: SortableTextContent,
  newValue: string
): Content[] {
  const newContents = [...contents];

  newContents[item.index] = { ...newContents[item.index], data: newValue };

  return newContents;
}

export function updateFileContent(
  contents: Content[],
  item: SortableFileGroupContent,
  newValue: string[]
): Content[] {
  const newContents = [...contents];

  const fileIndices = item.getIndices();

  if (newValue.length === 0) {
    fileIndices.sort((a, b) => b - a).forEach(index => newContents.splice(index, 1));
  } else {
    if (newValue.length < fileIndices.length) {
      fileIndices.slice(newValue.length).sort((a, b) => b - a).forEach(index => newContents.splice(index, 1));
    }

    fileIndices.slice(0, newValue.length).forEach((index, i) => {
      newContents[index] = { type: ContentTypeEnum.File, data: newValue[i] };
    });

    if (newValue.length > fileIndices.length) {
      const lastIndex = Math.max(...fileIndices);
      newValue.slice(fileIndices.length).forEach(fileUrl => {
        newContents.splice(lastIndex + 1, 0, { type: ContentTypeEnum.File, data: fileUrl });
      });
    }
  }

  return newContents;
}

export function deleteContent(contents: Content[], item: SortableContent): Content[] {
  const newContents = [...contents];
  item.getIndices().sort((a, b) => b - a).forEach(index => newContents.splice(index, 1));
  return newContents;
}

export function reorderContents(
  contents: Content[],
  groupedItems: SortableContent[],
  activeId: string,
  overId: string
): Content[] {
  const activeItemIndex = groupedItems.findIndex(item => item.id === activeId);
  const overItemIndex = groupedItems.findIndex(item => item.id === overId);

  if (activeItemIndex === -1 || overItemIndex === -1) return contents;

  let newContents = [...contents];
  const activeItem = groupedItems[activeItemIndex];
  const overItem = groupedItems[overItemIndex];

  let itemsToMove = activeItem.getIndices().map(index => newContents[index]);
  let indicesToRemove = activeItem.getIndices().sort((a, b) => a - b);

  let insertAtIndex: number;
  if (overItem.type === SortableContentType.Text) {
    insertAtIndex = activeItemIndex < overItemIndex ? overItem.getIndices()[0] + 1 : overItem.getIndices()[0];
  } else {
    const targetFileIndices = overItem.getIndices().sort((a, b) => a - b);
    insertAtIndex = activeItemIndex < overItemIndex ? targetFileIndices[targetFileIndices.length - 1] + 1 : targetFileIndices[0];
  }

  indicesToRemove.sort((a, b) => b - a).forEach(index => {
    newContents.splice(index, 1);
    if (index < insertAtIndex) insertAtIndex--;
  });

  newContents.splice(insertAtIndex, 0, ...itemsToMove);

  return newContents;
}