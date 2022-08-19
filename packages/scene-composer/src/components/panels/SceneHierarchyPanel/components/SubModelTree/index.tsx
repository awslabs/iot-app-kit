import React, { FC, useCallback, useState } from 'react';
import { Object3D, Event, Color, Mesh } from 'three';

import useMaterialEffect from '../../../../../hooks/useMaterialEffect';
import { generateUUID } from '../../../../../utils/mathUtils';
import Tree, { TreeItem } from '../../../../Tree';
import { ISubModelRefComponent, KnownComponentType } from '../../../../../interfaces';
import { ISceneComponentInternal, ISceneNodeInternal, useEditorState, useSceneDocument } from '../../../../../store';
import { useSceneComposerId } from '../../../../../common/sceneComposerIdContext';
import './SubModelTree.scss';

import TreeItemLabel from './SubModelTreeItemLabel';

export interface SubModelTreeProps {
  parentRef: string;
  object: Object3D<Event>;
  selected?: boolean;
  visible?: boolean;
  selectable?: boolean;
  expanded?: boolean;
}

const SubModelTree: FC<SubModelTreeProps> = ({
  parentRef,
  object,
  expanded: defaultExpanded = true,
  visible: defaultVisible = true,
}) => {
  const sceneComposerId = useSceneComposerId();
  const { appendSceneNodeInternal } = useSceneDocument(sceneComposerId);
  const { setSceneNodeObject3DMapping } = useEditorState(sceneComposerId);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [visible, setVisible] = useState(defaultVisible);

  const hoverColor = new Color(0x00ff00);

  const { name, children: allNodes } = object;
  const nodes = allNodes.filter((n) => !!n.name); // Only nodes with Names will appear as viable submodels

  const [transform, restore] = useMaterialEffect(
    /* istanbul ignore next */ (o) => {
      if (o instanceof Mesh) {
        o.material.color = hoverColor;
      }
    },
    object,
  );

  const onVisibilityToggled = useCallback((show) => {
    object.visible = show;
    setVisible(show);
  }, []);

  const onCreate = useCallback(() => {
    const nodeRef = `${parentRef}#${object.id}`;
    const subModelComponent: ISubModelRefComponent = {
      type: KnownComponentType.SubModelRef,
      parentRef,
      ref: generateUUID(),
      selector: object.name,
    };

    const node = {
      ref: nodeRef,
      name: object.name,
      components: [subModelComponent as ISceneComponentInternal],
      parentRef,
    } as ISceneNodeInternal;

    appendSceneNodeInternal(node);
    setSceneNodeObject3DMapping(nodeRef, object); // Cache Reference
  }, [object]);

  const onHover = useCallback((e) => {
    e.preventDefault();
    transform();
    return true;
  }, []);

  const onMouseLeave = useCallback((e) => {
    e.preventDefault();
    restore();
    return true;
  }, []);

  return (
    <TreeItem
      className={'tm-sub-model'}
      labelText={
        <TreeItemLabel
          onMouseOver={onHover}
          onMouseLeave={onMouseLeave}
          onAdd={onCreate}
          onVisibilityToggled={onVisibilityToggled}
          visible={visible}
        >
          {name}
        </TreeItemLabel>
      }
      expandable={nodes.length > 0}
      expanded={expanded}
      onExpand={setExpanded}
      selectable={false}
    >
      {nodes.length > 0 && (
        <Tree className={'tm-submodel-tree'}>
          {nodes.map((c) => (
            <SubModelTree key={c.id} parentRef={parentRef} object={c} />
          ))}
        </Tree>
      )}
    </TreeItem>
  );
};

SubModelTree.displayName = 'SubModelTree';

export default SubModelTree;
