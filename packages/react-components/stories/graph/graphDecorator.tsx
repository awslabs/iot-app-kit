import {
  context,
  type KnowledgeGraphContext,
} from '../../src/components/knowledge-graph/StateManager';
import { IntlProvider } from 'react-intl';
import { useParameter } from '@storybook/addons';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function KnowledgeGraphDecorator(Story: any) {
  const initialState = useParameter('KG', {
    selectedGraphNodeEntityId: null,
    setSelectedGraphNodeEntityId: () => {},
    queryResult: null,
    setQueryResult: () => {},
    clearGraphResults: () => {},
  }) as KnowledgeGraphContext;

  return (
    <context.Provider value={initialState}>
      <IntlProvider locale='en' defaultLocale='en'>
        <Story />
      </IntlProvider>
    </context.Provider>
  );
}
