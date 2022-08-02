import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Object3D, Event, Color, Mesh } from 'three';

import useMaterialEffect from '../../../hooks/useMaterialEffect';
import useSelectedNode from '../../../hooks/useSelectedNode';
import Tree, { TreeItem } from '../../Tree';
import { ISubModelRefComponent, KnownComponentType } from '../../../interfaces';
import { ISceneComponentInternal, ISceneNodeInternal, useStore } from '../../../store';
import { useSceneComposerId } from '../../../common/sceneComposerIdContext';
import { generateUUID } from '../../../utils/mathUtils';

import { useModelExplorer } from './Context';

export interface ModelExplorerTreeProps {
  object: Object3D<Event>;
  selected?: boolean;
  selectable?: boolean;
  expanded?: boolean;
}

interface TreeItemLabelProps {
  onCreateRef: () => void;
}

const TreeItemLabel: FC<TreeItemLabelProps> = ({ onCreateRef, children }) => {
  return <span onDoubleClick={onCreateRef}>{children}</span>;
};

export const ModelExplorerTree: FC<ModelExplorerTreeProps> = ({
  object,
  expanded: defaultExpanded = true,
  selectable = true,
}) => {
  const sceneComposerId = useSceneComposerId();
  const appendSceneNode = useStore(sceneComposerId)((state) => state.appendSceneNode);
  const setSceneNodeObject3DMapping = useStore(sceneComposerId)((state) => state.setSceneNodeObject3DMapping);
  const [expanded, setExpanded] = useState(defaultExpanded);

  const { setSelectedSceneSubmodelRef, getSelectedSubmodel, selectedSceneNodeRef } = useSelectedNode();

  const selected = useMemo(() => object === getSelectedSubmodel(), [getSelectedSubmodel]);

  const selectedColor = new Color(0x00ff00);

  const { name, children: allNodes } = object;
  const nodes = allNodes.filter((n) => !!n.name);

  const [transform, restore] = useMaterialEffect((o) => {
    if (o instanceof Mesh) {
      o.material.color = selectedColor;
    }
  }, object);

  useEffect(() => {
    if (selected) {
      transform();
    } else {
      restore();
    }
  }, [selected]);

  const onSelected = useCallback((s) => {
    setSelectedSceneSubmodelRef(s ? object.id || object.name : undefined);
  }, []);

  const onCreate = useCallback(() => {
    const nodeRef = `${selectedSceneNodeRef}#${object.id}`;
    const subModelComponent: ISubModelRefComponent = {
      type: KnownComponentType.SubModelRef,
      parentRef: selectedSceneNodeRef,
      ref: generateUUID(),
      selector: object.name,
    };

    const node = {
      ref: nodeRef,
      name: object.name,
      components: [subModelComponent as ISceneComponentInternal],
      parentRef: selectedSceneNodeRef,
    } as ISceneNodeInternal;

    appendSceneNode(node);
    setSceneNodeObject3DMapping(nodeRef, object); // Cache Reference
  }, [object]);

  return (
    <TreeItem
      labelText={<TreeItemLabel onCreateRef={onCreate}>{name}</TreeItemLabel>}
      expandable={nodes.length > 0}
      expanded={expanded}
      onExpand={setExpanded}
      onSelected={onSelected}
      selected={selected}
      selectable={selectable}
    >
      {nodes.length > 0 && (
        <Tree>
          {nodes.map((c) => (
            <ModelExplorerTree key={c.id} object={c} selectable={selectable && !selected} />
          ))}
        </Tree>
      )}
    </TreeItem>
  );
};

const ModelExplorerTreeView = () => {
  const { object3D } = useModelExplorer();

  return <Tree>{object3D && <ModelExplorerTree object={object3D} />}</Tree>;
};

export default ModelExplorerTreeView;
