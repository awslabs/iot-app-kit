import { IconLookup, findIconDefinition } from '@fortawesome/fontawesome-svg-core';
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
import { traverseSvg } from '../../../../components/panels/scene-components/tag-style/ColorSelectorCombo/ColorSelectorComboUtils/SvgParserHelper';
import useRuleResult from '../../../../hooks/useRuleResult';
import useTagSettings from '../../../../hooks/useTagSettings';
import {
  DefaultAnchorStatus,
  INavLink,
  ITagSettings,
  IValueDataBinding,
  KnownComponentType,
  SceneResourceType,
  SelectedAnchor,
} from '../../../../interfaces';
import { IIconLookup } from '../../../../models/SceneModels';
import { IAnchorComponentInternal, ISceneNodeInternal, accessStore, useViewOptionState } from '../../../../store';
import { applyDataBindingTemplate } from '../../../../utils/dataBindingTemplateUtils';
import { findComponentByType } from '../../../../utils/nodeUtils';
import { getSceneResourceInfo } from '../../../../utils/sceneResourceUtils';
import { colors } from '../../../../utils/styleUtils';
import { Anchor } from '../../../three';
import { WidgetSprite, WidgetVisual } from '../../../three/visuals';
import svgIconToWidgetSprite from '../common/SvgIconToWidgetSprite';

export interface AnchorWidgetProps {
  node: ISceneNodeInternal;
  chosenColor?: string;
  customIcon?: IIconLookup;
  defaultIcon: string;
  valueDataBinding?: IValueDataBinding;
  ruleBasedMapId?: string;
  navLink?: INavLink;
}

// Adds the custom objects to React Three Fiber
extend({ Anchor, WidgetVisual, WidgetSprite });

export function AsyncLoadedAnchorWidget({
  node,
  defaultIcon,
  chosenColor,
  customIcon,
  valueDataBinding,
  ruleBasedMapId,
  navLink,
}: AnchorWidgetProps): ReactElement {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const {
    selectedSceneNodeRef,
    highlightedSceneNodeRef,
    setHighlightedSceneNodeRef,
    getSceneNodeByRef,
    dataBindingTemplate,
  } = accessStore(sceneComposerId)((state) => state);
  const isViewing = accessStore(sceneComposerId)((state) => state.isViewing());
  const tagSettings: ITagSettings = useTagSettings();
  const autoRescale = useMemo(() => {
    return tagSettings.autoRescale;
  }, [tagSettings.autoRescale]);
  const ruleResult = useRuleResult({
    ruleMapId: ruleBasedMapId,
    dataBinding: valueDataBinding,
    defaultValue: defaultIcon,
  });

  const tagVisible = useViewOptionState(sceneComposerId).componentVisibilities[KnownComponentType.Tag];

  const onWidgetClick = accessStore(sceneComposerId)((state) => state.getEditorConfig().onWidgetClick);
  const getObject3DFromSceneNodeRef = accessStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);

  const isSelected = useMemo(() => highlightedSceneNodeRef === node.ref, [highlightedSceneNodeRef, node.ref]);

  // used to track changes on Selected state
  const prevIsSelectedRef = useRef(false);

  const rootGroupRef = useRef<THREE.Group>(null);
  const anchorRef = useRef<Anchor>(null);
  const bufferGeometryRef = useRef<THREE.BufferGeometry>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  const [_parent, setParent] = useState<THREE.Object3D | undefined>(getObject3DFromSceneNodeRef(node.parentRef));
  const [overrideCustomColor, setOverrideCustomColor] = useState<string | undefined>(undefined);
  const [overrideCustomIcon, setOverrideCustomIcon] = useState<IIconLookup | undefined>(undefined);

  const baseScale = useMemo(() => {
    // NOTE: For Fixed Size value was [0.05, 0.05, 1]
    const defaultScale = autoRescale ? [0.05, 0.05, 1] : [0.5, 0.5, 1];
    return new THREE.Vector3(...defaultScale).multiply(
      new THREE.Vector3(tagSettings.scale, tagSettings.scale, tagSettings.scale),
    );
  }, [autoRescale, tagSettings.scale]);

  useEffect(() => {
    setParent(node.parentRef ? getObject3DFromSceneNodeRef(node.parentRef) : undefined);
  }, [node.parentRef, getObject3DFromSceneNodeRef]);
  // Evaluate visual state based on data binding
  const visualState = useMemo(() => {
    // Anchor widget only accepts icon, otherwise, default to Info icon
    const ruleTargetInfo = getSceneResourceInfo(ruleResult.target as string);
    if (ruleTargetInfo.type === SceneResourceType.Icon) {
      // check overrideCustomColor is defined but not same as rule targetMetadata color
      if (overrideCustomColor && overrideCustomColor !== ruleResult.targetMetadata?.color) {
        setOverrideCustomColor(ruleResult.targetMetadata?.color);
      }
      // check overrideCustomColor is undefined but targetMetadata color is defined
      if (!overrideCustomColor && ruleResult.targetMetadata?.color) {
        setOverrideCustomColor(ruleResult.targetMetadata?.color);
      }

      // check overrideCustomIcon is defined but not same as rule targetMetadata icon
      if (
        overrideCustomIcon &&
        (overrideCustomIcon.iconName !== ruleResult.targetMetadata?.iconName ||
          overrideCustomIcon.prefix !== ruleResult.targetMetadata?.iconPrefix)
      ) {
        setOverrideCustomIcon({
          prefix: ruleResult.targetMetadata?.iconPrefix,
          iconName: ruleResult.targetMetadata?.iconName,
        } as IIconLookup);
      }

      // check targetMetadata icon is defined
      if (ruleResult.targetMetadata && (ruleResult.targetMetadata.iconName || ruleResult.targetMetadata.iconPrefix)) {
        setOverrideCustomIcon({
          prefix: ruleResult.targetMetadata?.iconPrefix,
          iconName: ruleResult.targetMetadata?.iconName,
        } as IIconLookup);
      }
      return ruleTargetInfo.value;
    }
    return defaultIcon;
  }, [ruleResult, defaultIcon, overrideCustomColor, overrideCustomIcon]);

  const visualRuleCustomColor = overrideCustomColor !== undefined ? overrideCustomColor : chosenColor;
  const visualCustomIcon =
    overrideCustomIcon !== undefined && overrideCustomIcon.iconName !== undefined ? overrideCustomIcon : customIcon;
  const selectedIconDefinition = findIconDefinition({
    prefix: visualCustomIcon?.prefix,
    iconName: visualCustomIcon?.iconName,
  } as IconLookup);
  const newCustomIcon = selectedIconDefinition?.icon[4] as string;
  const newIconWidth = selectedIconDefinition?.icon[0];
  const newIconHeight = selectedIconDefinition?.icon[1];
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
      (node.properties.alwaysVisible === undefined ? !tagSettings.enableOcclusion : node.properties.alwaysVisible) ===
      true;
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
      if (iconStyle === 'Custom' && (visualRuleCustomColor || newCustomIcon)) {
        let modifiedIconStyle = iconStyle;
        if (visualRuleCustomColor) {
          modifiedIconStyle = `${modifiedIconStyle}-${visualRuleCustomColor}`;
        }
        if (newCustomIcon) {
          modifiedIconStyle = `${modifiedIconStyle}-${newCustomIcon}`;
        }
        const modifiedSvg = modifySvg(iconString, visualRuleCustomColor, newCustomIcon, newIconWidth, newIconHeight);
        return svgIconToWidgetSprite(modifiedSvg, iconStyle, modifiedIconStyle, isAlwaysVisible, !autoRescale);
      }
      return svgIconToWidgetSprite(iconString, iconStyle, iconStyle, isAlwaysVisible, !autoRescale);
    });
  }, [
    autoRescale,
    visualRuleCustomColor,
    newCustomIcon,
    tagSettings.enableOcclusion,
    newIconHeight,
    newIconWidth,
    node.properties.alwaysVisible,
  ]);

  const isAnchor = useCallback(
    (nodeRef?: string) => {
      const node = getSceneNodeByRef(nodeRef);
      return findComponentByType(node, KnownComponentType.Tag) ?? false;
    },
    [getSceneNodeByRef],
  );

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
  }, [
    highlightedSceneNodeRef,
    isAnchor,
    isViewing,
    navLink,
    newCustomIcon,
    node,
    valueDataBinding,
    selectedSceneNodeRef,
    setHighlightedSceneNodeRef,
    visualRuleCustomColor,
    visualCustomIcon,
  ]);

  const onClick = useCallback(
    (event: ThreeEvent<MouseEvent>) => {
      // Anchor only has special onClick handling in viewing mode
      if (isViewing) {
        if (event.eventObject instanceof Anchor || event.eventObject instanceof THREE.LineSegments) {
          if (onWidgetClick) {
            const dataBindingContext = applyDataBindingTemplate(valueDataBinding, dataBindingTemplate);
            const componentTypes = node.components.map((component) => component.type) ?? [];
            onWidgetClick({
              componentTypes,
              nodeRef: node.ref,
              additionalComponentData: [
                {
                  chosenColor,
                  customIcon,
                  navLink,
                  dataBindingContext,
                },
              ],
            });
          }
        }
      }
    },
    [
      onWidgetClick,
      chosenColor,
      customIcon,
      dataBindingTemplate,
      isViewing,
      navLink,
      node.components,
      node.ref,
      valueDataBinding,
    ],
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
  }, [position]);

  useEffect(() => {
    const lines = linesRef.current;

    if (lines) {
      lines.layers.disable(Layers.RaycastAndRender);
      lines.layers.enable(Layers.RenderOnly);
    }
  }, []);

  const finalScale = new THREE.Vector3(1, 1, 1);

  if (rootGroupRef.current) {
    const worlsScale = new THREE.Vector3();
    rootGroupRef.current.getWorldScale(worlsScale);

    finalScale.divide(worlsScale);
  }

  return (
    <group ref={rootGroupRef} visible={tagVisible}>
      <group scale={finalScale}>
        <lineSegments ref={linesRef} onClick={onClick}>
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
 * This method parse the svg string and fill the color
 * @param iconString
 * @param chosenColor
 * @returns
 */
function modifySvg(
  iconString: string,
  chosenColor: string | undefined,
  customIcon: string | undefined,
  iconWidth: number | undefined,
  iconHeight: number | undefined,
): string {
  const parser = new DOMParser();
  const svgDocument = parser.parseFromString(iconString, 'image/svg+xml');
  const svgRoot = svgDocument.documentElement;
  traverseSvg(svgRoot, chosenColor ?? colors.customBlue, customIcon ?? '', iconWidth, iconHeight);
  const modifiedSvg = svgRoot.outerHTML;
  return modifiedSvg;
}
