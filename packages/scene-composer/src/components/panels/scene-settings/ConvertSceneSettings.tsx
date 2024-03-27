import React, { useCallback, useContext } from 'react';
import { useIntl } from 'react-intl';
import { Box, Button, Checkbox, CheckboxProps, NonCancelableCustomEvent } from '@cloudscape-design/components';

import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { staticNodeCount } from '../../../utils/entityModelUtils/sceneUtils';
import { useStore } from '../../../store';
import { KnownSceneProperty } from '../../../interfaces';
import { LAYER_DEFAULT_REFRESH_INTERVAL } from '../../../utils/entityModelUtils/sceneLayerUtils';

export const ConvertSceneSettings: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { formatMessage } = useIntl();
  const document = useStore(sceneComposerId)((state) => state.document);

  const setConvertSceneModalVisibility = useStore(sceneComposerId)((state) => state.setConvertSceneModalVisibility);
  const autoUpdateOn = useStore(sceneComposerId)(
    (state) => (state.getSceneProperty(KnownSceneProperty.LayerDefaultRefreshInterval) as number) > 0,
  );
  const setSceneProperty = useStore(sceneComposerId)((state) => state.setSceneProperty);

  const convertScene = useCallback(() => {
    setConvertSceneModalVisibility(true);
  }, [setConvertSceneModalVisibility]);

  const setAutoUpdate = useCallback(
    (e: NonCancelableCustomEvent<CheckboxProps.ChangeDetail>) => {
      setSceneProperty(
        KnownSceneProperty.LayerDefaultRefreshInterval,
        e.detail.checked ? LAYER_DEFAULT_REFRESH_INTERVAL : 0,
      );
    },
    [setSceneProperty],
  );

  return (
    <>
      <Box variant='p' fontWeight='bold' margin={{ bottom: 'xxs' }}>
        {formatMessage({ description: 'Sub-Section Header', defaultMessage: 'Convert to entities' })}
      </Box>
      <Box variant='p' margin={{ bottom: 'xxs' }}>
        {formatMessage({
          defaultMessage: 'Converting your scene to entities enables auto updating, filtering and querying your scene.',
          description: 'Sub-Section Description',
        })}
      </Box>

      <Button data-testid='convert-button' onClick={convertScene} disabled={staticNodeCount(document.nodeMap) === 0}>
        {formatMessage({ description: 'Button text', defaultMessage: 'Convert scene' })}
      </Button>

      {/* Temporary checkbox to enable/disable auto refresh layer before full Layer UX is ready */}
      <Box variant='p' fontWeight='bold' margin={{ bottom: 'xxs', top: 's' }}>
        {formatMessage({ description: 'Sub-Section Header', defaultMessage: 'Refresh cycle' })}
      </Box>
      <Checkbox data-testid='auto-update-checkbox' checked={autoUpdateOn} onChange={setAutoUpdate}>
        {formatMessage({ description: 'checkbox label', defaultMessage: 'Auto update (every 30s)' })}
      </Checkbox>
    </>
  );
};
