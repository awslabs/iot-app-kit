import React, { FC, useCallback, useState } from 'react';
import { Object3D, Color, Mesh } from 'three';

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
  object3D: Object3D;
  selected?: boolean;
  visible?: boolean;
  selectable?: boolean;
  expanded?: boolean;
}

const SubModelTree: FC<SubModelTreeProps> = ({
  parentRef,
  object3D,
  expanded: defaultExpanded = true,
  visible: defaultVisible = true,
}) => {
  const sceneComposerId = useSceneComposerId();
  const { appendSceneNodeInternal, document } = useSceneDocument(sceneComposerId);
  const { setSceneNodeObject3DMapping } = useEditorState(sceneComposerId);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [visible, setVisible] = useState(defaultVisible);

  const hoverColor = new Color(0x00ff00);

  const skipNode = !object3D.name || !object3D.userData?.isOriginal;

  const { name, children: allNodes } = object3D;
  const nodes = allNodes.filter((n) => !!n.name); // Only nodes with Names will appear as viable submodels

  const [transform, restore] = useMaterialEffect(
    /* istanbul ignore next */ (o) => {
      if (o instanceof Mesh && o.material && o.material.color) {
        o.material.color = hoverColor;
      }
    },
    object3D,
  );

  const onVisibilityToggled = useCallback((show) => {
    object3D.visible = show;
    setVisible(show);
  }, []);

  const onCreate = useCallback(() => {
    // Prevent duplicates
    const duplicates = Object.entries(document.nodeMap).filter(
      ([name, node]) => node.properties?.subModelId === object3D.name,
    );

    if (duplicates.length > 0) {
      return;
    }

    const nodeRef = `${parentRef}#${object3D.id}`;
    const subModelComponent: ISubModelRefComponent = {
      type: KnownComponentType.SubModelRef,
      parentRef,
      ref: generateUUID(),
      selector: object3D.name,
    };

    const node = {
      ref: nodeRef,
      name: object3D.name,
      components: [subModelComponent as ISceneComponentInternal],
      parentRef,
      transform: {
        position: [object3D.position.x, object3D.position.y, object3D.position.z],
        scale: [object3D.scale.x, object3D.scale.y, object3D.scale.z],
        rotation: [object3D.rotation.x, object3D.rotation.y, object3D.rotation.z],
      },
      transformConstraint: {
        snapToFloor: false,
      },
      childRefs: [],
      properties: {
        subModelId: object3D.name,
      },
    } as ISceneNodeInternal;

    appendSceneNodeInternal(node);
    setSceneNodeObject3DMapping(nodeRef, object3D); // Cache Reference
  }, [object3D, document.nodeMap]);

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

  if (skipNode) {
    return (
      <>
        {nodes.map((c) => (
          <SubModelTree key={c.id} parentRef={parentRef} object3D={c} expanded={false} />
        ))}
      </>
    );
  }

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
            <SubModelTree key={c.id} parentRef={parentRef} object3D={c} />
          ))}
        </Tree>
      )}
    </TreeItem>
  );
};

SubModelTree.displayName = 'SubModelTree';

export default SubModelTree;
