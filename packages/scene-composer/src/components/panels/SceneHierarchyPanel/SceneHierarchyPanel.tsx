import React, { useContext } from 'react';
import { defineMessages } from '@formatjs/intl';
import { useIntl } from 'react-intl';

import { COMPOSER_FEATURES } from '../../../interfaces';
import { sceneComposerIdContext } from '../../../sceneComposerIdContext';
import useFeature from '../../../hooks/useFeature';

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

export default () => {
  const { formatMessage } = useIntl();

  const sceneComposerId = useContext(sceneComposerIdContext);
  const [{ variation: canSearchHierarchy }] = useFeature(COMPOSER_FEATURES[COMPOSER_FEATURES.SceneHierarchySearch]);
  const [{ variation: canReorderHierarchy }] = useFeature(COMPOSER_FEATURES[COMPOSER_FEATURES.SceneHierarchyReorder]);
  const [{ variation: canSelectMultiple }] = useFeature(COMPOSER_FEATURES[COMPOSER_FEATURES.SceneHierarchyMultiSelect]);

  return (
    <SceneHierarchyDataProvider
      sceneComposerId={sceneComposerId}
      selectionMode={canSelectMultiple === 'T1' ? 'multi' : 'single'}
    >
      <Layout>
        {canSearchHierarchy === 'T1' && (
          <Toolbar>
            <Typeahead placeholder={formatMessage(strings.searchPlaceholder)} />
          </Toolbar>
        )}
        <Main>
          <SceneHierarchyTree enableDragAndDrop={canReorderHierarchy === 'T1'} />
        </Main>
      </Layout>
    </SceneHierarchyDataProvider>
  );
};
