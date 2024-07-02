import React, { useCallback, } from 'react';

import SceneViewer from './SceneViewer';

import DashboardManager from './DashboardManager';

import { Container, Header, SpaceBetween } from '@cloudscape-design/components';


const ScenePage = () => {

  const onSelectionChanged = useCallback(
    (e: any) => {
      console.log('onSelectionChanged event fired with data: ', e); 
    },
    []
  );

  const onWidgetClick = useCallback((e: any) => {
    console.log('onWidgetClick event fired with data: ', e);
  }, []);

  return (

        <DashboardManager>
          <SpaceBetween size={'s'}>
            <Container header={<Header>Scene</Header>}>
              <SceneViewer onSelectionChanged={onSelectionChanged} onWidgetClick={onWidgetClick} />
            </Container>
          </SpaceBetween>
        </DashboardManager>

  );
};

export default ScenePage;