import React, { FC, useCallback, useContext, useMemo } from 'react';
import styled from 'styled-components';
import { ButtonDropdown, SpaceBetween } from '@awsui/components-react';
import { useIntl } from 'react-intl';

import { COMPOSER_FEATURES, KnownComponentType } from '../../interfaces';
import { sceneComposerIdContext } from '../../common/sceneComposerIdContext';
import { ICameraComponentInternal, useStore, useViewOptionState } from '../../store';
import { Checked } from '../../assets/auto-gen/icons';
import useActiveCamera from '../../hooks/useActiveCamera';
import { findComponentByType } from '../../utils/nodeUtils';
import { getCameraSettings } from '../../utils/cameraUtils';
import { getGlobalSettings } from '../../common/GlobalSettings';

const StyledSpaceBetween = styled(SpaceBetween)`
  flex: 1;
  justify-content: right;
`;

export const TopBar: FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { motionIndicatorVisible, toggleMotionIndicatorVisibility } = useViewOptionState(sceneComposerId);
  const nodeMap = useStore(sceneComposerId)((state) => state.document.nodeMap);
  const getSceneNodeByRef = useStore(sceneComposerId)((state) => state.getSceneNodeByRef);
  const getObject3DBySceneNodeRef = useStore(sceneComposerId)((state) => state.getObject3DBySceneNodeRef);
  const { setActiveCameraSettings } = useActiveCamera();
  const intl = useIntl();
  const cameraViewEnabled = getGlobalSettings().featureConfig[COMPOSER_FEATURES.CameraView];

  const cameraItems = useMemo(() => {
    return Object.values(nodeMap)
      .filter((node) => {
        return findComponentByType(node, KnownComponentType.Camera);
      })
      .map((cameraNode) => {
        return {
          id: cameraNode.ref,
          text: cameraNode!.name,
        };
      });
  }, [nodeMap]);

  const settingsOnItemClick = ({ detail }) => {
    switch (detail.id) {
      case KnownComponentType.MotionIndicator:
        toggleMotionIndicatorVisibility();
        break;
    }
  };

  const setActiveCameraOnItemClick = useCallback(
    ({ detail }) => {
      const node = getSceneNodeByRef(detail.id);
      const cameraComponent = findComponentByType(node, KnownComponentType.Camera) as ICameraComponentInternal;
      const object3D = getObject3DBySceneNodeRef(detail.id);

      setActiveCameraSettings(getCameraSettings(object3D, cameraComponent), 'transition', true);
    },
    [setActiveCameraSettings],
  );

  return (
    <StyledSpaceBetween direction='horizontal' size='xxs'>
      <ButtonDropdown
        data-testid={'view-options'}
        items={[
          {
            id: KnownComponentType.MotionIndicator,
            text: intl.formatMessage({
              defaultMessage: 'Motion indicator',
              description: 'dropdown button option text for motion indicator component',
            }),
            iconSvg: motionIndicatorVisible ? <Checked /> : <></>,
          },
        ]}
        onItemClick={settingsOnItemClick}
      >
        {intl.formatMessage({ defaultMessage: 'View Options', description: 'view options dropdown button text' })}
      </ButtonDropdown>
      {cameraViewEnabled && (
        <ButtonDropdown data-testid={'camera-views'} items={cameraItems} onItemClick={setActiveCameraOnItemClick}>
          {intl.formatMessage({ defaultMessage: 'Cameras', description: 'camera views dropdown button text' })}
        </ButtonDropdown>
      )}
    </StyledSpaceBetween>
  );
};
