import React, { FC } from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';

import LogProvider from '../../../logger/react-logger/log-provider';

const strings = defineMessages({
  NoModelSelected: {
    defaultMessage: 'Select a model ref node to explore the subtree',
    description:
      'A message displayed in a panel to indicate to the user they need to select an object in the scene in order for this panel to be populated.',
  },
});

interface ModelExplorerLayoutProps {
  active: boolean;
}

const ModelExplorerLayout: FC<ModelExplorerLayoutProps> = ({ active, children }) => {
  return (
    <LogProvider namespace='ModelExplorer'>
      {active && children}
      {!active && <FormattedMessage tagName={'p'} {...strings.NoModelSelected} />}
    </LogProvider>
  );
};

export default ModelExplorerLayout;
