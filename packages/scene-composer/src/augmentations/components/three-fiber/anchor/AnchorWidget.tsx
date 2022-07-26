import * as THREE from 'three';
import React, { ReactElement, useContext, useEffect, useMemo, useRef } from 'react';
import { extend, ThreeEvent, useThree } from '@react-three/fiber';

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

  const selectedSceneNodeRef = useStore(sceneComposerId)((state) => state.selectedSceneNodeRef);
  const setSelectedSceneNodeRef = useStore(sceneComposerId)((state) => state.setSelectedSceneNodeRef);
  const highlightedSceneNodeRef = useStore(sceneComposerId)((state) => state.highlightedSceneNodeRef);
  const setHighlightedSceneNodeRef = useStore(sceneComposerId)((state) => state.setHighlighedSceneNodeRef);
  const isViewing = useStore(sceneComposerId)((state) => state.isViewing());
  const onAnchorClick = useStore(sceneComposerId)((state) => state.getEditorConfig().onAnchorClick);
  const dataInput = useStore(sceneComposerId)((state) => state.dataInput);
  const dataBindingTemplate = useStore(sceneComposerId)((state) => state.dataBindingTemplate);

  const isSelected = highlightedSceneNodeRef === node.ref;

  // used to track changes on Selected state
  const prevIsSelectedRef = useRef(false);

  const anchorRef = useRef<Anchor>();
  const bufferGeometryRef = useRef<THREE.BufferGeometry>();
  const linesRef = useRef<THREE.LineSegments>();

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

  useEffect(() => {
    // Initialize isSelected to false on mount
    prevIsSelectedRef.current = false;
  }, []);

  // Update Selected state and trigger events
  useEffect(() => {
    // only applies to viewing mode
    if (isViewing) {
      const isSelected = selectedSceneNodeRef === node.ref;
      const isDeselected = selectedSceneNodeRef === undefined;

      if (highlightedSceneNodeRef === node.ref && isDeselected) {
        // current Tag Deselected
        setHighlightedSceneNodeRef(undefined);
      } else if (isSelected) {
        // current Tag Selected
        setHighlightedSceneNodeRef(node.ref);
      }

      // only send update if the Selected state changes and current node was clicked
      if (isSelected !== prevIsSelectedRef.current) {
        prevIsSelectedRef.current = isSelected;

        if (onAnchorClick && (isSelected || isDeselected)) {
          const dataBindingContext = !valueDataBinding?.dataBindingContext
            ? undefined
            : applyDataBindingTemplate(valueDataBinding, dataBindingTemplate);
          onAnchorClick({
            eventType: 'change',
            anchorNodeRef: node.ref,
            isSelected: isSelected,
            navLink,
            dataBindingContext,
          });
        }
      }
    }
  }, [selectedSceneNodeRef, highlightedSceneNodeRef, isViewing, node, onAnchorClick, valueDataBinding, navLink]);

  const onClick = (event: ThreeEvent<MouseEvent>) => {
    // Anchor only has special onClick handling in viewing mode
    if (isViewing) {
      if (event.eventObject instanceof Anchor) {
        const anchor = event.eventObject as Anchor;
        setSelectedSceneNodeRef(selectedSceneNodeRef === node.ref ? undefined : node.ref);

        anchor.isSelected = isSelected;

        if (onAnchorClick) {
          const dataBindingContext = !valueDataBinding?.dataBindingContext
            ? undefined
            : applyDataBindingTemplate(valueDataBinding, dataBindingTemplate);
          onAnchorClick({
            eventType: 'click',
            anchorNodeRef: node.ref,
            navLink: navLink,
            dataBindingContext,
          });
        }

        event.stopPropagation();
      }
    }
  };

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

  return (
    <React.Fragment>
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
    </React.Fragment>
  );
}

export const AnchorWidget: React.FC<AnchorWidgetProps> = (props: AnchorWidgetProps) => {
  return (
    <React.Suspense fallback={null}>
      <AsyncLoadedAnchorWidget {...props} />
    </React.Suspense>
  );
};
