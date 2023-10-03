import React, { useContext, useMemo } from 'react';
import { useIntl, IntlShape } from 'react-intl';

import { OrbitCameraSvg, PanCameraSvg } from '../../../../assets/svgs';
import { CameraControlsType, COMPOSER_FEATURES } from '../../../../interfaces';
import { getGlobalSettings } from '../../../../common/GlobalSettings';
import { sceneComposerIdContext } from '../../../../common/sceneComposerIdContext';
import { useStore } from '../../../../store';
import { ToolbarItem } from '../../common/ToolbarItem';
import { ToolbarItemGroup } from '../../common/styledComponents';
import { ToolbarItemOptions } from '../../common/types';
import useMatterportViewer from '../../../../hooks/useMatterportViewer';

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

const firstPersonCameraControlItemOptions: (ToolbarItemOptions & { mode: CameraControlsType })[] = [
  {
    icon: { scale: 1.04, svg: PanCameraSvg },
    label: 'Pointer Lock',
    mode: 'pointerLock',
    text: '3D Pointer Lock',
    uuid: 'camera-controls-pointer-lock',
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

const intlFirstPersonCameraControlItems = (intl: IntlShape): { label: string; text: string }[] => [
  {
    label: intl.formatMessage({ defaultMessage: 'Pointer Lock', description: 'Menu Item' }),
    text: intl.formatMessage({ defaultMessage: '3D Pointer Lock', description: 'Menu Item' }),
  },
];

const cameraControlItems = (
  intl: IntlShape,
  firstPersonOn: boolean | undefined,
): (ToolbarItemOptions & { mode: CameraControlsType })[] => {
  const items: (ToolbarItemOptions & { mode: CameraControlsType })[] = [];
  cameraControlItemsOptions.forEach((item, index) => {
    items.push({ ...item, ...intlCameraControlItems(intl)[index] });
  });
  if (firstPersonOn) {
    firstPersonCameraControlItemOptions.forEach((item, index) => {
      items.push({ ...item, ...intlFirstPersonCameraControlItems(intl)[index] });
    });
  }
  return items;
};

export interface SceneItemGroupProps {
  isViewing?: boolean;
}

export function SceneItemGroup({ isViewing = false }: SceneItemGroupProps): JSX.Element {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const cameraControlsType = useStore(sceneComposerId)((state) => state.cameraControlsType);
  const setCameraControlsType = useStore(sceneComposerId)((state) => state.setCameraControlsType);
  const { enableMatterportViewer } = useMatterportViewer();
  const firstPersonOn = getGlobalSettings().featureConfig[COMPOSER_FEATURES.FirstPerson];
  const intl = useIntl();

  const initialSelectedItem = useMemo(() => {
    return (
      cameraControlItems(intl, firstPersonOn).find((item) => item.mode === cameraControlsType) ??
      cameraControlItemsOptions[0]
    );
  }, [cameraControlItems, cameraControlsType, firstPersonOn]);

  const items = useMemo(() => {
    const rawItems = cameraControlItems(intl, firstPersonOn);
    rawItems.forEach((item) => (item.isSelected = item.mode === cameraControlsType));
    return rawItems;
  }, [cameraControlsType, firstPersonOn]);

  return (
    <ToolbarItemGroup>
      {!isViewing && <AddObjectMenu />}
      {!enableMatterportViewer && (
        <ToolbarItem
          items={items}
          initialSelectedItem={initialSelectedItem}
          type='mode-select'
          onSelect={(selectedItem) => setCameraControlsType(selectedItem.mode)}
        />
      )}
    </ToolbarItemGroup>
  );
}
