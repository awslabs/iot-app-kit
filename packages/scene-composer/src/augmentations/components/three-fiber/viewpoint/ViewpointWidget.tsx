import React, { ReactElement, useContext, useEffect, useMemo, useState } from 'react';
import { extend, ThreeEvent, useLoader } from '@react-three/fiber';
import { SVGLoader, SVGResult } from 'three-stdlib';

import { ISceneNodeInternal, useEditorState } from '../../../../store';
import { sceneComposerIdContext } from '../../../../sceneComposerIdContext';
import { SelectedViewpointIcon, ViewpointIcon } from '../../../../assets';
import svgIconToWidgetVisual from '../common/SvgIconToWidgetVisual';
import { WidgetVisual } from '../../../three/visuals';
import { Viewpoint, ViewpointState } from '../../../three';

// Adds the custom objects to React Three Fiber
extend({ Viewpoint, WidgetVisual });

export interface ViewpointProps {
  node: ISceneNodeInternal;
}

const AsyncLoadViewpointWidget = ({ node }: ViewpointProps): ReactElement => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { isEditing, selectedViewpointNodeRef, setSelectedSceneNodeRef, setSelectedViewpointNodeRef } =
    useEditorState(sceneComposerId);

  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);

  const visual = useMemo(() => {
    const svgData: SVGResult = useLoader(SVGLoader, ViewpointIcon.dataUri);
    return svgIconToWidgetVisual(svgData, ViewpointState.Deselected, (node.properties.alwaysVisible || false) === true);
  }, []);

  const selectedVisual = useMemo(() => {
    const svgData: SVGResult = useLoader(SVGLoader, SelectedViewpointIcon.dataUri);
    return svgIconToWidgetVisual(svgData, ViewpointState.Selected, (node.properties.alwaysVisible || false) === true);
  }, []);

  useEffect(() => {
    setIsSelected(node.ref === selectedViewpointNodeRef);
  }, [selectedViewpointNodeRef]);

  const onPointerUp = (e: ThreeEvent<MouseEvent>) => {
    if (isEditing()) {
      setSelectedSceneNodeRef(node.ref);
    }

    setSelectedViewpointNodeRef(node.ref);
    e.stopPropagation();
  };

  return (
    <viewpoint
      onPointerOver={() => {
        setIsHighlighted(true);
      }}
      onPointerLeave={() => {
        setIsHighlighted(false);
      }}
      onPointerUp={onPointerUp}
      isSelected={isSelected || isHighlighted}
      userData={{ nodeRef: node.ref }}
    >
      {visual}
      {selectedVisual}
    </viewpoint>
  );
};

export const ViewpointWidget: React.FC<ViewpointProps> = (props: ViewpointProps) => {
  return (
    <React.Suspense fallback={null}>
      <AsyncLoadViewpointWidget {...props} />
    </React.Suspense>
  );
};
