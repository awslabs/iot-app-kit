import {
  Box,
  Button,
  Checkbox,
  type CheckboxProps,
  type NonCancelableCustomEvent,
} from '@cloudscape-design/components';
import { useCallback, useContext } from 'react';
import { useIntl } from 'react-intl';

import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { KnownSceneProperty } from '../../../interfaces';
import { accessStore } from '../../../store';
import { LAYER_DEFAULT_REFRESH_INTERVAL } from '../../../utils/entityModelUtils/sceneLayerUtils';
import { isDynamicScene } from '../../../utils/entityModelUtils/sceneUtils';

export const ConvertSceneSettings: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { formatMessage } = useIntl();
  const document = accessStore(sceneComposerId)((state) => state.document);

  const setConvertSceneModalVisibility = accessStore(sceneComposerId)((state) => state.setConvertSceneModalVisibility);
  const autoUpdateOn = accessStore(sceneComposerId)(
    (state) => (state.getSceneProperty(KnownSceneProperty.LayerDefaultRefreshInterval) as number) > 0,
  );
  const setSceneProperty = accessStore(sceneComposerId)((state) => state.setSceneProperty);

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

      <Button data-testid='convert-button' onClick={convertScene} disabled={isDynamicScene(document)}>
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
