import React, { useCallback, useContext } from 'react';
import { useIntl } from 'react-intl';
import { Box, Button } from '@awsui/components-react';

import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { staticNodeCount } from '../../../utils/entityModelUtils/sceneUtils';
import { useStore } from '../../../store';

export const ConvertSceneSettings: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { formatMessage } = useIntl();
  const document = useStore(sceneComposerId)((state) => state.document);

  const setConvertSceneModalVisibility = useStore(sceneComposerId)((state) => state.setConvertSceneModalVisibility);

  const convertScene = useCallback(() => {
    setConvertSceneModalVisibility(true);
  }, [setConvertSceneModalVisibility]);

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
    </>
  );
};
