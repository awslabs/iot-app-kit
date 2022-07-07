import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useIntl, IntlShape } from 'react-intl';

import { OrbitCameraSvg, PanCameraSvg } from '../../../../assets/svgs';
import { CameraControlsType, COMPOSER_FEATURES } from '../../../../interfaces';
import { sceneComposerIdContext } from '../../../../sceneComposerIdContext';
import { useStore } from '../../../../store';
import { ToolbarItem } from '../../common/ToolbarItem';
import { ToolbarItemGroup } from '../../common/styledComponents';
import { ToolbarItemOptions } from '../../common/types';

import { AddObjectMenu } from './AddObjectMenu';

const cameraControlItemsOptions: (ToolbarItemOptions & { mode: CameraControlsType })[] = [
  {
    icon: { scale: 1.04, svg: OrbitCameraSvg },
    label: 'Orbit',
    mode: 'orbit',
    text: '3D Orbit',
    uuid: 'camera-controls-orbit',
  },
  {
    icon: { scale: 1.04, svg: PanCameraSvg },
    label: 'Pan',
    mode: 'pan',
    text: '3D Pan',
    uuid: 'camera-controls-pan',
  },
  {
    isDisabled: true,
    icon: { name: 'view-full' },
    label: 'Immersive',
    mode: 'immersive',
    text: '360 Image',
    uuid: 'camera-controls-immersive',
    feature: { name: COMPOSER_FEATURES.IMMERSIVE_VIEW },
  },
];

const intlCameraControlItems = (intl: IntlShape): { label: string; text: string }[] => [
  {
    label: intl.formatMessage({ defaultMessage: 'Orbit', description: 'Menu Item' }),
    text: intl.formatMessage({ defaultMessage: '3D Orbit', description: 'Menu Item' }),
  },
  {
    label: intl.formatMessage({ defaultMessage: 'Pan', description: 'Menu Item' }),
    text: intl.formatMessage({ defaultMessage: '3D Pan', description: 'Menu Item' }),
  },
  {
    label: intl.formatMessage({ defaultMessage: '360 Image', description: 'Menu Item' }),
    text: intl.formatMessage({ defaultMessage: '360 Image', description: 'Menu Item' }),
  },
];

const cameraControlItems = (intl: IntlShape): (ToolbarItemOptions & { mode: CameraControlsType })[] => {
  const items: (ToolbarItemOptions & { mode: CameraControlsType })[] = [];
  cameraControlItemsOptions.forEach((item, index) => {
    items.push({ ...item, ...intlCameraControlItems(intl)[index] });
  });

  return items;
};

export interface SceneItemGroupProps {
  isViewing?: boolean;
}

export function SceneItemGroup({ isViewing = false }: SceneItemGroupProps) {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const cameraControlsType = useStore(sceneComposerId)((state) => state.cameraControlsType);
  const setCameraControlsType = useStore(sceneComposerId)((state) => state.setCameraControlsType);
  const selectedViewpointNodeRef = useStore(sceneComposerId)((state) => state.selectedViewpointNodeRef);
  const intl = useIntl();
  const [controlsUpdated, setControlsUpdated] = useState<number>(0);

  const initialSelectedItem = useMemo(() => {
    return cameraControlItems(intl).find((item) => item.mode === cameraControlsType) ?? cameraControlItemsOptions[0];
  }, [cameraControlItems, cameraControlsType]);

  // This enables the Immersive camera controls item if a viewpoint is selected
  useEffect(() => {
    const immersiveItem = cameraControlItemsOptions.filter((item) => item.mode === 'immersive');

    if (immersiveItem.length > 0) {
      immersiveItem[0].isDisabled = !selectedViewpointNodeRef;
    }
    setControlsUpdated(controlsUpdated + 1); // Only way to force an update on first viewpoint selection
  }, [selectedViewpointNodeRef]);

  return (
    <ToolbarItemGroup>
      {!isViewing && <AddObjectMenu />}
      <ToolbarItem
        items={cameraControlItems(intl)}
        initialSelectedItem={initialSelectedItem}
        type='mode-select'
        onClick={(selectedItem) => setCameraControlsType(selectedItem.mode)}
      />
    </ToolbarItemGroup>
  );
}
