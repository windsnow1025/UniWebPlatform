import React from 'react';
import {closestCenter, DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import SortableContent from './SortableContent';
import {ContentTypeEnum} from "../../../../client";
import {createSortableContents, SortableContentType} from "../../../../src/common/message/SortableContent";

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

  const groupedItems = React.useMemo(() => {
    return createSortableContents(message.contents);
  }, [message.contents]);

  const handleContentChange = (itemId, newValue) => {
    const item = groupedItems.find(item => item.id === itemId);
    if (!item) return;

    const newContents = [...message.contents];

    if (item.type === SortableContentType.Text) {
      // Update text content
      newContents[item.index] = {
        ...newContents[item.index],
        data: newValue
      };
    } else if (item.type === SortableContentType.Files) {
      // Handle file updates
      const fileIndices = item.getIndices();

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

    if (item.type === SortableContentType.Text) {
      // Delete single text content
      newContents.splice(item.index, 1);
    } else if (item.type === SortableContentType.Files) {
      // Delete all files in group in reverse order
      const indicesToRemove = item.getIndices();
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

    if (activeItem.type === SortableContentType.Text) {
      itemsToMove = [newContents[activeItem.index]];
      indicesToRemove = [activeItem.index];
    } else {
      // Get all file items in this group
      const fileIndices = activeItem.getIndices();
      itemsToMove = fileIndices.map(index => newContents[index]);
      indicesToRemove = fileIndices.sort((a, b) => a - b);
    }

    // Find insertion point
    let insertAtIndex;

    if (overItem.type === SortableContentType.Text) {
      // If target is text, insert before or after based on position
      insertAtIndex = activeItemIndex < overItemIndex ?
        overItem.index + 1 : overItem.index;
    } else {
      // If target is files group, get the first file's index
      const targetFileIndices = overItem.getIndices().sort((a, b) => a - b);
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
          if (item.type === SortableContentType.Text) {
            return (
              <SortableContent
                key={item.id}
                id={item.id}
                type="text"
                content={item.getData()}
                onChange={(newData) => handleContentChange(item.id, newData)}
                onDelete={() => handleContentDelete(item.id)}
                shouldSanitize={shouldSanitize}
                rawEditableState={rawEditableState}
              />
            );
          } else {
            return (
              <SortableContent
                key={item.id}
                id={item.id}
                type="files"
                files={item.getData()}
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