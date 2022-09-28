import React, { useCallback } from 'react';
import { Autosuggest } from '@awsui/components-react';
import { defineMessages, useIntl } from 'react-intl';

import { useSceneHierarchyData } from '../../SceneHierarchyDataProvider';

const strings = defineMessages({
  enteredTextLabel: {
    defaultMessage: 'Use: {value}',
    description: 'Label clarifying the exact text a user is searching for.',
  },
});

const Typeahead = (props) => {
  const { searchTerms, search } = useSceneHierarchyData();
  const { formatMessage } = useIntl();

  const doSearch = useCallback(
    (e) => {
      const filter = e.detail.value;
      search(filter);
    },
    [search],
  );

  return (
    <Autosuggest
      value={searchTerms}
      onChange={doSearch}
      enteredTextLabel={(val) => formatMessage(strings.enteredTextLabel, { value: val })}
      {...props}
    />
  );
};

export default Typeahead;
