import React from 'react';
import {DndContext, closestCenter, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import SortableContent from './SortableContent';
import {ContentTypeEnum} from "../../../../client";

function SortableContents({
                            message,
                            setMessage,
                            shouldSanitize,
                            rawEditableState,
                          }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {distance: 5},
    })
  );

  // Process contents to group consecutive file content items
  const groupedItems = React.useMemo(() => {
    const items = [];
    let currentFileGroup = [];

    message.contents.forEach((content, index) => {
      if (content.type === ContentTypeEnum.File) {
        currentFileGroup.push({index, content});
      } else {
        if (currentFileGroup.length > 0) {
          // Add the file group as one sortable item
          items.push({
            id: `file-group-${currentFileGroup[0].index}`,
            type: 'files',
            fileItems: currentFileGroup
          });
          currentFileGroup = [];
        }

        // Add text content as individual item
        items.push({
          id: `text-${index}`,
          type: 'text',
          index,
          content
        });
      }
    });

    // Add any remaining file group
    if (currentFileGroup.length > 0) {
      items.push({
        id: `file-group-${currentFileGroup[0].index}`,
        type: 'files',
        fileItems: currentFileGroup
      });
    }

    return items;
  }, [message.contents]);

  const handleContentChange = (itemId, newValue) => {
    const item = groupedItems.find(item => item.id === itemId);
    if (!item) return;

    const newContents = [...message.contents];

    if (item.type === 'text') {
      // Update text content
      newContents[item.index] = {
        ...newContents[item.index],
        data: newValue
      };
    } else if (item.type === 'files') {
      // Handle file updates
      const fileIndices = item.fileItems.map(fi => fi.index);

      // If new value is empty array, remove all files in this group
      if (newValue.length === 0) {
        // Remove files in reverse order to maintain correct indices
        [...fileIndices].sort((a, b) => b - a).forEach(index => {
          newContents.splice(index, 1);
        });
      } else {
        // Remove excess files if new list is shorter
        if (newValue.length < fileIndices.length) {
          const indicesToRemove = fileIndices.slice(newValue.length);
          [...indicesToRemove].sort((a, b) => b - a).forEach(index => {
            newContents.splice(index, 1);
          });
        }

        // Update remaining files
        const remainingIndices = fileIndices.slice(0, Math.min(fileIndices.length, newValue.length));
        remainingIndices.forEach((index, i) => {
          newContents[index] = {
            type: ContentTypeEnum.File,
            data: newValue[i]
          };
        });

        // Add new files if new list is longer
        if (newValue.length > fileIndices.length) {
          const lastIndex = Math.max(...fileIndices);
          const newFiles = newValue.slice(fileIndices.length);

          let insertIndex = lastIndex + 1;
          newFiles.forEach(fileUrl => {
            newContents.splice(insertIndex, 0, {
              type: ContentTypeEnum.File,
              data: fileUrl
            });
            insertIndex++;
          });
        }
      }
    }

    setMessage({...message, contents: newContents});
  };

  const handleContentDelete = (itemId) => {
    const item = groupedItems.find(item => item.id === itemId);
    if (!item) return;

    const newContents = [...message.contents];

    if (item.type === 'text') {
      // Delete single text content
      newContents.splice(item.index, 1);
    } else if (item.type === 'files') {
      // Delete all files in group in reverse order
      const indicesToRemove = item.fileItems.map(fi => fi.index);
      [...indicesToRemove].sort((a, b) => b - a).forEach(index => {
        newContents.splice(index, 1);
      });
    }

    setMessage({...message, contents: newContents});
  };

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (!over || active.id === over.id) return;

    const activeItemIndex = groupedItems.findIndex(item => item.id === active.id);
    const overItemIndex = groupedItems.findIndex(item => item.id === over.id);

    if (activeItemIndex === -1 || overItemIndex === -1) return;

    // Create a new contents array to manipulate
    let newContents = [...message.contents];
    const activeItem = groupedItems[activeItemIndex];
    const overItem = groupedItems[overItemIndex];

    // Items to move and their indices
    let itemsToMove = [];
    let indicesToRemove = [];

    if (activeItem.type === 'text') {
      itemsToMove = [newContents[activeItem.index]];
      indicesToRemove = [activeItem.index];
    } else {
      // Get all file items in this group
      itemsToMove = activeItem.fileItems.map(fi => newContents[fi.index]);
      indicesToRemove = activeItem.fileItems.map(fi => fi.index).sort((a, b) => a - b);
    }

    // Find insertion point
    let insertAtIndex;

    if (overItem.type === 'text') {
      // If target is text, insert before or after based on position
      insertAtIndex = activeItemIndex < overItemIndex ?
        overItem.index + 1 : overItem.index;
    } else {
      // If target is files group, get the first file's index
      const targetFileIndices = overItem.fileItems.map(fi => fi.index).sort((a, b) => a - b);
      insertAtIndex = activeItemIndex < overItemIndex ?
        targetFileIndices[targetFileIndices.length - 1] + 1 : targetFileIndices[0];
    }

    // Remove items in reverse order to maintain correct indices
    // Sort indices in descending order to prevent shifting problems
    [...indicesToRemove].sort((a, b) => b - a).forEach(index => {
      newContents.splice(index, 1);
      if (index < insertAtIndex) {
        insertAtIndex--;
      }
    });

    // Insert items at new position
    newContents.splice(insertAtIndex, 0, ...itemsToMove);

    setMessage({...message, contents: newContents});
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={groupedItems.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        {groupedItems.length !== 0 && groupedItems.map((item) => {
          if (item.type === 'text') {
            return (
              <SortableContent
                key={item.id}
                id={item.id}
                type="text"
                content={item.content.data}
                onChange={(newData) => handleContentChange(item.id, newData)}
                onDelete={() => handleContentDelete(item.id)}
                shouldSanitize={shouldSanitize}
                rawEditableState={rawEditableState}
              />
            );
          } else {
            const fileUrls = item.fileItems.map(fi => fi.content.data);
            return (
              <SortableContent
                key={item.id}
                id={item.id}
                type="files"
                files={fileUrls}
                onChange={(newFiles) => handleContentChange(item.id, newFiles)}
                onDelete={() => handleContentDelete(item.id)}
                rawEditableState={rawEditableState}
              />
            );
          }
        })
        }
      </SortableContext>
    </DndContext>
  );
}

export default SortableContents;