import Box from '@awsui/components-react/box';
import React, { FC, useCallback, useState } from 'react';
import * as awsui from '@awsui/design-tokens';
import { applyMode, Mode } from '@awsui/global-styles';
import styled, { ThemeProvider } from 'styled-components';
import Container from '@awsui/components-react/container';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { darkTheme } from '../src/theme';
import Tree, { TreeItem } from '../src/components/Tree';
import draggable from '../src/enhancers/draggable';
import droppable from '../src/enhancers/droppable';

const DraggableTreeItem = droppable(draggable(TreeItem));
const DroppableTree = droppable(Tree);

const FancyBox = styled(Box)`
  width: 400px;
  height: 100%;
  overflow: hidden;
  background-color: ${awsui.colorBackgroundLayoutMain};
`;

const Layout: FC = ({ children }) => {
  applyMode(Mode.Dark);

  return (
    <ThemeProvider theme={darkTheme}>
      <Container>
        <FancyBox>{children}</FancyBox>
      </Container>
    </ThemeProvider>
  );
};

export default {
  title: 'Components/Trees',
  component: Tree,
};

export const Basic = () => {
  return (
    <Layout>
      <Tree>
        <TreeItem labelText={'Level 1'}>
          <Tree>
            <TreeItem labelText={'Level 2'} />
            <TreeItem labelText={'Level 2'} />
            <TreeItem labelText={'Level 2'}>
              <TreeItem labelText={'Level 3'} />
            </TreeItem>
          </Tree>
        </TreeItem>
      </Tree>
    </Layout>
  );
};

export const Expandable = () => {
  return (
    <Layout>
      <Tree>
        <TreeItem labelText={'Level 1'} expandable>
          <Tree>
            <TreeItem labelText={'Level 2'} />
            <TreeItem labelText={'Level 2'} />
            <TreeItem labelText={'Level 2'} expandable>
              <TreeItem labelText={'Level 3'} />
            </TreeItem>
          </Tree>
        </TreeItem>
      </Tree>
    </Layout>
  );
};

export const DragNDrop = () => {
  const itemType = 'treeitem';

  const [items, setItems] = useState([
    {
      id: 1,
      parentId: null,
    },
    {
      id: 2,
      parentId: null,
    },
    {
      id: 3,
      parentId: 2,
    },
    {
      id: 4,
      parentId: null,
    },
  ]);

  const onDropped = useCallback(
    (item, { beenHandled }, parentId) => {
      if (!beenHandled) {
        const newItems = [...items];
        newItems.forEach((i) => {
          if (i.id === item.id) {
            i.parentId = parentId;
          }
        });

        setItems(newItems);
      }
    },
    [items],
  );

  const buildTree = (baseItems) => {
    return baseItems?.map((item) => {
      const children = items?.filter((i) => i.parentId === item.id);
      const [expanded, setExpanded] = useState(true);

      return (
        <DraggableTreeItem
          key={item.id}
          labelText={`Item ${item.id}`}
          data={item}
          expandable={children.length > 0}
          expanded={expanded}
          onExpand={setExpanded}
          dataType={itemType}
          acceptDrop={itemType}
          onDropped={(data, e) => onDropped(data, e, item.id)}
        >
          {children.length > 0 && (
            <DroppableTree acceptDrop={itemType} onDropped={(data, e) => onDropped(data, e, item.id)}>
              {buildTree(children)}
            </DroppableTree>
          )}
        </DraggableTreeItem>
      );
    });
  };

  return (
    <Layout>
      <DndProvider backend={HTML5Backend}>
        <DroppableTree acceptDrop={itemType} onDropped={(data, e) => onDropped(data, e, null)}>
          {buildTree(items?.filter((i) => i.parentId === null))}
        </DroppableTree>
      </DndProvider>
    </Layout>
  );
};
