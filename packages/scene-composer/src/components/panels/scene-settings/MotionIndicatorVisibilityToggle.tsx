import React, { useContext, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { Box, Toggle } from '@awsui/components-react';

import { useStore, useViewOptionState } from '../../../store';
import { sceneComposerIdContext } from '../../../common/sceneComposerIdContext';
import { KnownComponentType } from '../../../interfaces';

export const MotionIndicatorVisibilityToggle: React.FC = () => {
  const sceneComposerId = useContext(sceneComposerIdContext);
  const { motionIndicatorVisible, toggleMotionIndicatorVisibility } = useViewOptionState(sceneComposerId);
  const getComponentRefByType = useStore(sceneComposerId)((state) => state.getComponentRefByType);
  const componentNodeMap = useStore(sceneComposerId)((state) => state.document.componentNodeMap);
  const { formatMessage } = useIntl();

  const hasMotionIndicator = useMemo(() => {
    return Object.keys(getComponentRefByType(KnownComponentType.MotionIndicator)).length > 0;
  }, [componentNodeMap, getComponentRefByType]);

  return (
    <React.Fragment>
      <Box variant='p' fontWeight='bold' margin={{ bottom: 'xxs' }}>
        {formatMessage({ description: 'Sub section label', defaultMessage: 'Motion indicator' })}
      </Box>
      <Toggle
        disabled={!hasMotionIndicator}
        checked={motionIndicatorVisible}
        onChange={toggleMotionIndicatorVisibility}
      >
        {formatMessage({ description: 'Toggle label', defaultMessage: 'Visibility' })}
      </Toggle>
    </React.Fragment>
  );
};
