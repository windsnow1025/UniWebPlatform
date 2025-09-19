import React from 'react';
import {closestCenter, DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {SortableContext, verticalListSortingStrategy} from "@dnd-kit/sortable";
import SortableContent from './SortableContent';
import {
  createSortableContents,
  deleteContent,
  reorderContents,
  SortableContentType,
  updateTextContent
} from "../../../lib/common/message/SortableContent";

function SortableContents({
                            contents,
                            setContents,
                            rawEditableState,
                            setConversationUpdateKey,
                            isTemporaryChat,
                          }) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {distance: 5},
    })
  );

  const sortableItems = React.useMemo(() => {
    return createSortableContents(contents);
  }, [contents]);

  const handleContentChange = (itemId, newValue) => {
    const item = sortableItems.find(item => item.id === itemId);
    if (!item || item.type !== SortableContentType.Text) return;

    const updatedContents = updateTextContent(contents, item, newValue);
    setContents(updatedContents);
  };

  const handleContentDelete = (itemId) => {
    const item = sortableItems.find(item => item.id === itemId);
    if (!item) return;

    setContents(deleteContent(contents, item));
    setConversationUpdateKey(prev => prev + 1);
  };

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (!over || active.id === over.id) return;
    setContents(reorderContents(contents, sortableItems, active.id, over.id));
    setConversationUpdateKey(prev => prev + 1);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sortableItems.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-start-start">
          {sortableItems.map(item => (
            <SortableContent
              key={item.id}
              id={item.id}
              type={item.type}
              content={item.content.data}
              onChange={(newData) => handleContentChange(item.id, newData)}
              onDelete={() => handleContentDelete(item.id)}
              rawEditableState={rawEditableState}
              setConversationUpdateKey={setConversationUpdateKey}
              isTemporaryChat={isTemporaryChat}
              contents={contents}
              setContents={setContents}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default SortableContents;