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
} from "../../../lib/common/message/SortableContent";

function SortableContents({
                            contents,
                            setContents,
                            rawEditableState,
                            setConversationUpdateKey,
                          }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {distance: 5},
    })
  );

  const groupedItems = React.useMemo(() => {
    return createSortableContents(contents);
  }, [contents]);

  const handleContentChange = (itemId, newValue) => {
    const item = groupedItems.find(item => item.id === itemId);
    if (!item) return;

    let updatedContents;
    if (item.type === SortableContentType.Text) {
      updatedContents = updateTextContent(contents, item, newValue);
    } else {
      updatedContents = updateFileContent(contents, item, newValue);
    }

    setContents(updatedContents);

    if (item.type === SortableContentType.Files) {
      console.log("update triggered in sortable contents")
      setConversationUpdateKey(prev => prev + 1);
    }
  };

  const handleContentDelete = (itemId) => {
    const item = groupedItems.find(item => item.id === itemId);
    if (!item) return;
    setContents(deleteContent(contents, item));

    setConversationUpdateKey(prev => prev + 1);
  };

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (!over || active.id === over.id) return;
    setContents(reorderContents(contents, groupedItems, active.id, over.id));

    setConversationUpdateKey(prev => prev + 1);
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
            setConversationUpdateKey={setConversationUpdateKey}
          />
        ))}
      </SortableContext>
    </DndContext>
  );
}

export default SortableContents;
