import React from 'react';
import { defineMessages } from '@formatjs/intl';
import { useIntl } from 'react-intl';

import { COMPOSER_FEATURES } from '../../../interfaces';
import useFeature from '../../../hooks/useFeature';
import LogProvider from '../../../logger/react-logger/log-provider';

import Layout, { Main, Toolbar } from './layout';
import Typeahead from './components/Typeahead';
import SceneHierarchyTree from './components/SceneHierarchyTree';
import SceneHierarchyDataProvider from './SceneHierarchyDataProvider';

const strings = defineMessages({
  searchPlaceholder: {
    defaultMessage: 'Find resources',
    description: 'Placeholder hint message for searching across entities',
  },
});

const SceneHierarchyPanel = () => {
  const { formatMessage } = useIntl();

  const [{ variation: canSelectMultiple }] = useFeature(COMPOSER_FEATURES[COMPOSER_FEATURES.SceneHierarchyMultiSelect]);

  return (
    <LogProvider namespace='SceneHierarchyPanel'>
      <SceneHierarchyDataProvider selectionMode={canSelectMultiple === 'T1' ? 'multi' : 'single'}>
        <Layout>
          <Toolbar>
            <Typeahead placeholder={formatMessage(strings.searchPlaceholder)} />
          </Toolbar>
          <Main>
            <SceneHierarchyTree enableDragAndDrop={true} />
          </Main>
        </Layout>
      </SceneHierarchyDataProvider>
    </LogProvider>
  );
};

SceneHierarchyPanel.displayName = 'SceneHierarchyPanel';

export default SceneHierarchyPanel;
