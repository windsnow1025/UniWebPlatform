import React from 'react';
import {closestCenter, DndContext, PointerSensor, useSensor, useSensors} from "@dnd-kit/core";
import {SortableContext} from "@dnd-kit/sortable";
import SortableContent from './SortableContent';

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

  const handleDragEnd = (event) => {
    const {active, over} = event;
    if (!over || active.id === over.id) return;

    const oldIndex = parseInt(active.id.split('-')[1]);
    const newIndex = parseInt(over.id.split('-')[1]);

    const newContents = [...contents];
    const [movedItem] = newContents.splice(oldIndex, 1);
    newContents.splice(newIndex, 0, movedItem);

    setContents(newContents);
    setConversationUpdateKey(prev => prev + 1);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={contents.map((_, index) => `content-${index}`)}
      >
        <div
          className="flex-start-center my-1"
        >
          {contents.map((content, index) => (
            <SortableContent
              key={`content-${index}`}
              id={`content-${index}`}
              index={index}
              content={content}
              contents={contents}
              setContents={setContents}
              rawEditableState={rawEditableState}
              setConversationUpdateKey={setConversationUpdateKey}
              isTemporaryChat={isTemporaryChat}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default SortableContents;