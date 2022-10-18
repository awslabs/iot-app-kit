import * as THREE from 'three';
import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { extend, ThreeEvent } from '@react-three/fiber';

import {
  ErrorIconSvgString,
  InfoIconSvgString,
  SelectedIconSvgString,
  VideoIconSvgString,
  WarningIconSvgString,
} from '../../../../assets';
import { WidgetSprite, WidgetVisual } from '../../../three/visuals';
import { Anchor } from '../../../three';
import {
  DefaultAnchorStatus,
  INavLink,
  IRuleBasedMap,
  IValueDataBinding,
  KnownComponentType,
  SceneResourceType,
  SelectedAnchor,
} from '../../../../interfaces';
import { IAnchorComponentInternal, ISceneNodeInternal, useStore } from '../../../../store';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { dataBindingValuesProvider, ruleEvaluator } from '../../../../utils/dataBindingUtils';
import { applyDataBindingTemplate } from '../../../../utils/dataBindingTemplateUtils';
import { getSceneResourceInfo } from '../../../../utils/sceneResourceUtils';
import svgIconToWidgetSprite from '../common/SvgIconToWidgetSprite';
import { findComponentByType } from '../../../../utils/nodeUtils';
import { Layers } from '../../../../common/constants';

export interface AnchorWidgetProps {
  node: ISceneNodeInternal;

  defaultIcon: string;
  valueDataBinding?: IValueDataBinding;
  rule?: IRuleBasedMap;
  navLink?: INavLink;
}

// Adds the custom objects to React Three Fiber
extend({ Anchor, WidgetVisual, WidgetSprite });

export function AsyncLoadedAnchorWidget({
  node,
  defaultIcon,
  valueDataBinding,
  rule,
  navLink,
}: AnchorWidgetProps): ReactElement {
  const sceneComposerId = useContext(sceneComposerIdContext);

  const {
    selectedSceneNodeRef,
    highlightedSceneNodeRef,
    setHighlightedSceneNodeRef,
    getSceneNodeByRef,
    dataInput,
    dataBindingTemplate,
  } = useStore(sceneComposerId)((state) => state);
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing());

  const onWidgetClick = useStore(sceneComposerId)((state) => state.getEditorConfig().onWidgetClick);
  const getObject3DFromSceneNodeRef = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);

  const isSelected = useMemo(() => highlightedSceneNodeRef === node.ref, [highlightedSceneNodeRef, node.ref]);

  // used to track changes on Selected state
  const prevIsSelectedRef = useRef(false);

  const anchorRef = useRef<Anchor>();
  const bufferGeometryRef = useRef<THREE.BufferGeometry>();
  const linesRef = useRef<THREE.LineSegments>();

  const [parent, setParent] = useState<THREE.Object3D | undefined>(getObject3DFromSceneNodeRef(node.parentRef));

  useEffect(() => {
    setParent(node.parentRef ? getObject3DFromSceneNodeRef(node.parentRef) : undefined);
  }, [node.parentRef]);

  // Evaluate visual state based on data binding
  const visualState = useMemo(() => {
    const values: Record<string, any> = dataBindingValuesProvider(dataInput, valueDataBinding, dataBindingTemplate);
    const ruleTarget = ruleEvaluator(defaultIcon, values, rule);
    const ruleTargetInfo = getSceneResourceInfo(ruleTarget as string);
    // Anchor widget only accepts icon, otherwise, default to Info icon
    return ruleTargetInfo.type === SceneResourceType.Icon ? ruleTargetInfo.value : defaultIcon;
  }, [rule, dataInput, valueDataBinding, defaultIcon]);

  const defaultVisualMap = useMemo(() => {
    // NOTE: Due to the refactor from a Widget Visual (SVG to Mesh) to a Widget Sprite (SVG to Sprite)
    //  we need a new way of showing selection. This is done by showing a transparent larger image BEHIND the
    //  existing anchors. It is why Selected is first.
    const keys = [
      SelectedAnchor,
      DefaultAnchorStatus.Info,
      DefaultAnchorStatus.Warning,
      DefaultAnchorStatus.Error,
      DefaultAnchorStatus.Video,
    ];

    const isAlwaysVisible =
      (node.properties.alwaysVisible === undefined ? true : node.properties.alwaysVisible) === true;
    const iconStrings = [
      SelectedIconSvgString,
      InfoIconSvgString,
      WarningIconSvgString,
      ErrorIconSvgString,
      VideoIconSvgString,
    ];
    return iconStrings.map((iconString, index) => {
      return svgIconToWidgetSprite(iconString, keys[index], isAlwaysVisible);
    });
  }, []);

  const isAnchor = (nodeRef?: string) => {
    const node = getSceneNodeByRef(nodeRef);
    return findComponentByType(node, KnownComponentType.Tag) ?? false;
  };

  useEffect(() => {
    // Initialize isSelected to false on mount
    prevIsSelectedRef.current = false;
  }, []);

  // Update Selected state and trigger events
  useEffect(() => {
    // only applies to viewing mode
    if (isViewing) {
      const isSelected = selectedSceneNodeRef === node.ref;
      const isDeselected = selectedSceneNodeRef !== node.ref && !isAnchor(selectedSceneNodeRef);

      if (highlightedSceneNodeRef === node.ref && isDeselected) {
        // current Tag Deselected
        setHighlightedSceneNodeRef(undefined);
      } else if (isSelected) {
        // current Tag Selected
        setHighlightedSceneNodeRef(node.ref);
      }
    }
  }, [selectedSceneNodeRef, highlightedSceneNodeRef, isViewing, node, valueDataBinding, navLink]);

  const onClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      // Anchor only has special onClick handling in viewing mode
      if (isViewing) {
        if (event.eventObject instanceof Anchor) {
          if (onWidgetClick) {
            const dataBindingContext = !valueDataBinding?.dataBindingContext
              ? undefined
              : applyDataBindingTemplate(valueDataBinding, dataBindingTemplate);
            const componentTypes = node.components.map((component) => component.type) ?? [];
            onWidgetClick({
              componentTypes,
              nodeRef: node.ref,
              additionalComponentData: [
                {
                  navLink,
                  dataBindingContext,
                },
              ],
            });
          }

          event.stopPropagation();
        }
      }
    },
    [onWidgetClick, selectedSceneNodeRef],
  );

  const position = useMemo(() => {
    const pos = new THREE.Vector3();

    const anchorComponent = findComponentByType(node, KnownComponentType.Tag) as IAnchorComponentInternal;
    if (anchorComponent?.offset) {
      pos.add(new THREE.Vector3(anchorComponent.offset[0], anchorComponent.offset[1], anchorComponent.offset[2]));
    }
    return pos;
  }, [node]);

  useEffect(() => {
    const geometry = bufferGeometryRef.current;

    if (geometry) {
      // TODO: Find a way to point at the edge and not the center
      //  Bounding box intersection did not work as expected nor did shortening the line
      const points = [new THREE.Vector3(), position];
      geometry.setFromPoints(points);
    }
  }, [position, bufferGeometryRef.current]);

  useEffect(() => {
    const lines = linesRef.current;

    if (lines) {
      lines.layers.disable(Layers.RaycastAndRender);
      lines.layers.enable(Layers.RenderOnly);
    }
  }, [linesRef.current]);

  const parentScale = new THREE.Vector3(1, 1, 1);
  if (parent) {
    parent.getWorldScale(parentScale);
  }

  const finalScale = parent ? new THREE.Vector3(1, 1, 1).divide(parentScale) : new THREE.Vector3(1, 1, 1);

  return (
    <group scale={finalScale}>
      <lineSegments ref={linesRef}>
        <lineBasicMaterial color={'#ffffff'} />
        <bufferGeometry ref={bufferGeometryRef} attach={'geometry'} />
      </lineSegments>
      <anchor
        ref={anchorRef}
        visualState={visualState}
        isSelected={isSelected}
        onClick={onClick}
        position={position.toArray()}
        scale={[0.5, 0.5, 1]} // NOTE: For Fixed Size value was [0.05, 0.05, 1]
      >
        {defaultVisualMap}
      </anchor>
    </group>
  );
}

export const AnchorWidget: React.FC<AnchorWidgetProps> = (props: AnchorWidgetProps) => {
  return (
    <React.Suspense fallback={null}>
      <AsyncLoadedAnchorWidget {...props} />
    </React.Suspense>
  );
};
