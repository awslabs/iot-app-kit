import { ThreeEvent, extend } from '@react-three/fiber';
import React, { ReactElement, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

import {
  CustomIconSvgString,
  ErrorIconSvgString,
  InfoIconSvgString,
  SelectedIconSvgString,
  VideoIconSvgString,
  WarningIconSvgString,
} from '../../../../assets';
import { Layers } from '../../../../common/constants';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { traverseSvg } from '../../../../components/panels/scene-components/tag-style/ColorPicker/ColorPickerUtils/SvgParserHelper';
import useTagSettings from '../../../../hooks/useTagSettings';
import {
  DefaultAnchorStatus,
  INavLink,
  IRuleBasedMap,
  ITagSettings,
  IValueDataBinding,
  KnownComponentType,
  SceneResourceType,
  SelectedAnchor,
} from '../../../../interfaces';
import { IAnchorComponentInternal, ISceneNodeInternal, useStore, useViewOptionState } from '../../../../store';
import { applyDataBindingTemplate } from '../../../../utils/dataBindingTemplateUtils';
import { dataBindingValuesProvider, ruleEvaluator } from '../../../../utils/dataBindingUtils';
import { findComponentByType } from '../../../../utils/nodeUtils';
import { getSceneResourceInfo } from '../../../../utils/sceneResourceUtils';
import { colors } from '../../../../utils/styleUtils';
import { Anchor } from '../../../three';
import { WidgetSprite, WidgetVisual } from '../../../three/visuals';
import svgIconToWidgetSprite from '../common/SvgIconToWidgetSprite';
import useBindingData from '../../../../hooks/useBindingData';

export interface AnchorWidgetProps {
  node: ISceneNodeInternal;
  chosenColor?: string;
  defaultIcon: string;
  valueDataBinding?: IValueDataBinding;
  rule?: IRuleBasedMap;
  navLink?: INavLink;
}

type overrideCustomColorType = (value: string | undefined) => void;

// Adds the custom objects to React Three Fiber
extend({ Anchor, WidgetVisual, WidgetSprite });

export function AsyncLoadedAnchorWidget({
  node,
  defaultIcon,
  chosenColor,
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
  const tagSettings: ITagSettings = useTagSettings();
  const autoRescale = useMemo(() => {
    return tagSettings.autoRescale;
  }, [tagSettings.autoRescale]);
  const bindings = useMemo(() => (valueDataBinding ? [valueDataBinding] : undefined), [valueDataBinding]);
  const bindingData = useBindingData(bindings).data?.at(0);

  const tagVisible = useViewOptionState(sceneComposerId).componentVisibilities[KnownComponentType.Tag];

  const onWidgetClick = useStore(sceneComposerId)((state) => state.getEditorConfig().onWidgetClick);
  const getObject3DFromSceneNodeRef = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);

  const isSelected = useMemo(() => highlightedSceneNodeRef === node.ref, [highlightedSceneNodeRef, node.ref]);

  // used to track changes on Selected state
  const prevIsSelectedRef = useRef(false);

  const rootGroupRef = useRef<THREE.Group>(null);
  const anchorRef = useRef<Anchor>(null);
  const bufferGeometryRef = useRef<THREE.BufferGeometry>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const [_parent, setParent] = useState<THREE.Object3D | undefined>(getObject3DFromSceneNodeRef(node.parentRef));
  const [overrideCustomColor, setOverrideCustomColor] = useState<string | undefined>(undefined);
  const baseScale = useMemo(() => {
    // NOTE: For Fixed Size value was [0.05, 0.05, 1]
    const defaultScale = autoRescale ? [0.05, 0.05, 1] : [0.5, 0.5, 1];
    return new THREE.Vector3(...defaultScale).multiply(
      new THREE.Vector3(tagSettings.scale, tagSettings.scale, tagSettings.scale),
    );
  }, [autoRescale, tagSettings.scale]);

  useEffect(() => {
    setParent(node.parentRef ? getObject3DFromSceneNodeRef(node.parentRef) : undefined);
  }, [node.parentRef]);

  // Evaluate visual state based on data binding
  const visualState = useMemo(() => {
    const values: Record<string, unknown> =
      bindingData ?? dataBindingValuesProvider(dataInput, valueDataBinding, dataBindingTemplate);
    const ruleTarget = ruleEvaluator(defaultIcon, values, rule);
    // Evaluate if returned rule is a string type and value is custom icon color
    getCustomIconColor(ruleTarget, setOverrideCustomColor);
    const ruleTargetInfo = getSceneResourceInfo(ruleTarget as string);
    // Anchor widget only accepts icon, otherwise, default to Info icon
    return ruleTargetInfo.type === SceneResourceType.Icon ? ruleTargetInfo.value : defaultIcon;
  }, [rule, dataInput, valueDataBinding, defaultIcon, bindingData]);

  const visualRuleCustomColor = overrideCustomColor !== undefined ? overrideCustomColor : chosenColor;
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
      DefaultAnchorStatus.Custom,
    ];

    const isAlwaysVisible =
      (node.properties.alwaysVisible === undefined ? true : node.properties.alwaysVisible) === true;
    const iconStrings = [
      SelectedIconSvgString,
      InfoIconSvgString,
      WarningIconSvgString,
      ErrorIconSvgString,
      VideoIconSvgString,
      CustomIconSvgString,
    ];
    return iconStrings.map((iconString, index) => {
      const iconStyle = keys[index];
      if (iconStyle === 'Custom') {
        const modifiedSvg = modifySvgColor(iconString, visualRuleCustomColor);
        return svgIconToWidgetSprite(
          modifiedSvg,
          iconStyle,
          visualRuleCustomColor ? `${iconStyle}-${visualRuleCustomColor}` : iconStyle,
          isAlwaysVisible,
          !autoRescale,
        );
      }
      return svgIconToWidgetSprite(iconString, iconStyle, iconStyle, isAlwaysVisible, !autoRescale);
    });
  }, [autoRescale, visualRuleCustomColor]);

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
  }, [selectedSceneNodeRef, highlightedSceneNodeRef, isViewing, node, valueDataBinding, navLink, chosenColor]);

  const onClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      // Anchor only has special onClick handling in viewing mode
      if (isViewing) {
        if (event.eventObject instanceof Anchor) {
          if (onWidgetClick) {
            const dataBindingContext = applyDataBindingTemplate(valueDataBinding, dataBindingTemplate);
            const componentTypes = node.components.map((component) => component.type) ?? [];
            onWidgetClick({
              componentTypes,
              nodeRef: node.ref,
              additionalComponentData: [
                {
                  chosenColor,
                  navLink,
                  dataBindingContext,
                },
              ],
            });
          }
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

  const finalScale = new THREE.Vector3(1, 1, 1);

  if (rootGroupRef.current) {
    const worlsScale = new THREE.Vector3();
    rootGroupRef.current.getWorldScale(worlsScale);

    finalScale.divide(worlsScale);
  }

  return (
    <group ref={rootGroupRef} visible={tagVisible}>
      <group scale={finalScale}>
        <lineSegments ref={linesRef}>
          <lineBasicMaterial color='#ffffff' />
          <bufferGeometry ref={bufferGeometryRef} attach='geometry' />
        </lineSegments>
        <anchor
          ref={anchorRef}
          visualState={visualState}
          isSelected={isSelected}
          onClick={onClick}
          position={position.toArray()}
          scale={baseScale.toArray()}
        >
          {defaultVisualMap}
        </anchor>
      </group>
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

/**
 * This method sets the custom icon color if it is returned from the rule.
 * @param ruleTarget
 * @param setOverrideCustomColor
 */
function getCustomIconColor(ruleTarget: string | number, setOverrideCustomColor: overrideCustomColorType) {
  const ruleColor =
    typeof ruleTarget === 'string' && ruleTarget.includes('Custom-')
      ? ruleTarget.split(':')[1].split('-')[1]
      : undefined;
  setOverrideCustomColor(ruleColor);
}

/**
 * This method parse the svg string and fill the color
 * @param iconString
 * @param chosenColor
 * @returns
 */
function modifySvgColor(iconString: string, chosenColor: string | undefined): string {
  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(iconString, 'image/svg+xml');
  const svgRoot = svgDocument.documentElement;
  traverseSvg(svgRoot, chosenColor ?? colors.customBlue);
  const modifiedSvg = svgRoot.outerHTML;
  return modifiedSvg;
}
