import React, { useContext, useMemo } from 'react';
import { useIntl, IntlShape } from 'react-intl';

import { OrbitCameraSvg, PanCameraSvg } from '../../../../assets/svgs';
import { CameraControlsType, KnownSceneProperty } from '../../../../interfaces';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
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
  const isMatterportEnabled = useStore(sceneComposerId)(
    (state) =>
      state.getSceneProperty(KnownSceneProperty.MatterportModelId) &&
      state.getSceneProperty(KnownSceneProperty.MatterportModelId) !== '',
  );
  const intl = useIntl();

  const initialSelectedItem = useMemo(() => {
    return cameraControlItems(intl).find((item) => item.mode === cameraControlsType) ?? cameraControlItemsOptions[0];
  }, [cameraControlItems, cameraControlsType]);

  const items = useMemo(() => {
    const rawItems = cameraControlItems(intl);
    rawItems.forEach((item) => (item.isSelected = item.mode === cameraControlsType));
    return rawItems;
  }, [cameraControlsType]);

  return (
    <ToolbarItemGroup>
      {!isViewing && <AddObjectMenu />}
      {!isMatterportEnabled && (
        <ToolbarItem
          items={items}
          initialSelectedItem={initialSelectedItem}
          type='mode-select'
          onClick={(selectedItem) => setCameraControlsType(selectedItem.mode)}
        />
      )}
    </ToolbarItemGroup>
  );
}
