import { ContentTypeEnum, Content } from '@/client';

export enum SortableContentType {
  Text = 'text',
  File = 'file'
}

export class SortableContent {
  id: string;
  type: SortableContentType;
  index: number;
  content: Content;

  constructor(id: string, type: SortableContentType, index: number, content: Content) {
    this.id = id;
    this.type = type;
    this.index = index;
    this.content = content;
  }
}

export function createSortableContents(contents: Content[]): SortableContent[] {
  return contents.map((content, index) => {
    const type = content.type === ContentTypeEnum.File ? SortableContentType.File : SortableContentType.Text;
    const id = `${type}-${index}`;
    return new SortableContent(id, type, index, content);
  });
}

export function updateTextContent(
  contents: Content[],
  item: SortableContent,
  newValue: string
): Content[] {
  const newContents = [...contents];
  newContents[item.index] = { ...newContents[item.index], data: newValue };
  return newContents;
}

export function deleteContent(contents: Content[], item: SortableContent): Content[] {
  const newContents = [...contents];
  const indices = [item.index];
  indices.sort((a, b) => b - a).forEach(index => newContents.splice(index, 1));
  return newContents;
}

export function reorderContents(
  contents: Content[],
  sortableItems: SortableContent[],
  activeId: string,
  overId: string
): Content[] {
  const activeItem = sortableItems.find(item => item.id === activeId);
  const overItem = sortableItems.find(item => item.id === overId);

  if (!activeItem || !overItem) return contents;

  const newContents = [...contents];
  const [movedItem] = newContents.splice(activeItem.index, 1);
  newContents.splice(overItem.index, 0, movedItem);

  return newContents;
}