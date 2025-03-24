import React from 'react';
import {closestCenter, DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import SortableContent from './SortableContent';
import {
  createSortableContents,
  deleteContent,
  reorderContents,
  SortableContentType,
  updateFileContent,
  updateTextContent
} from "../../../../src/common/message/SortableContent";

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

    let updatedContents;
    if (item.type === SortableContentType.Text) {
      updatedContents = updateTextContent(message.contents, item, newValue);
    } else {
      updatedContents = updateFileContent(message.contents, item, newValue);
    }

    setMessage({ ...message, contents: updatedContents });
  };

  const handleContentDelete = (itemId) => {
    const item = groupedItems.find(item => item.id === itemId);
    if (!item) return;
    setMessage({ ...message, contents: deleteContent(message.contents, item) });
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setMessage({ ...message, contents: reorderContents(message.contents, groupedItems, active.id, over.id) });
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
        {groupedItems.map(item => (
          <SortableContent
            key={item.id}
            id={item.id}
            type={item.type}
            content={item.getData()}
            onChange={(newData) => handleContentChange(item.id, newData)}
            onDelete={() => handleContentDelete(item.id)}
            rawEditableState={rawEditableState}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

export default SortableContents;