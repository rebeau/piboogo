import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialTreeData = [
  {
    id: 'category-a',
    title: '카테고리 A',
    children: [
      {
        id: 'subcategory-a1',
        title: '서브카테고리 A-1',
        children: [
          { id: 'subcategory-a1-1', title: '서브카테고리 A-1-1', children: [] },
          { id: 'subcategory-a1-2', title: '서브카테고리 A-1-2', children: [] },
        ],
      },
      { id: 'subcategory-a2', title: '서브카테고리 A-2', children: [] },
    ],
  },
  {
    id: 'category-b',
    title: '카테고리 B',
    children: [
      { id: 'subcategory-b1', title: '서브카테고리 B-1', children: [] },
    ],
  },
];

const TreeNode = ({ node, index, parentId }) => {
  return (
    <Draggable draggableId={node.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            padding: '8px',
            margin: '4px 0',
            backgroundColor: '#fff',
            border: '1px solid lightgray',
            borderRadius: '4px',
            ...provided.draggableProps.style,
          }}
        >
          {node.title}
          <Droppable droppableId={node.id} type="NODE">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{ paddingLeft: '20px' }}
              >
                {node.children.map((child, i) => (
                  <TreeNode
                    key={child.id}
                    node={child}
                    index={i}
                    parentId={node.id}
                  />
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      )}
    </Draggable>
  );
};

const NestedDndTree = () => {
  const [treeData, setTreeData] = useState(initialTreeData);

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="root" type="NODE">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {treeData.map((node, index) => (
              <TreeNode
                key={node.id}
                node={node}
                index={index}
                parentId={null}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default NestedDndTree;
