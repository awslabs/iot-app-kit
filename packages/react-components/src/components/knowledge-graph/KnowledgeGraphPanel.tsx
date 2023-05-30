import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { IntlProvider, FormattedMessage } from 'react-intl';
import { ElementDefinition } from 'cytoscape';
import { Button, Container, Header, Input, SpaceBetween } from '@cloudscape-design/components';
import { TwinMakerKGQueryDataModule } from '@iot-app-kit/source-iottwinmaker';
import { Graph } from './graph';
import StateManager, { useKnowledgeGraphState } from './StateManager';
import { createKnowledgeGraphQueryClient } from './KnowledgeGraphQueries';
import { ResponseParser } from './responseParser';
import { getElementsDefinition } from './utils';

interface KnowledgeGraphInterface {
  kgDataSource: TwinMakerKGQueryDataModule;
}
const MAX_NUMBER_HOPS = 10;

const KnowledgeGraphContainer: React.FC<KnowledgeGraphInterface> = ({ kgDataSource }) => {
  const { selectedGraphNodeEntityId, setQueryResult, queryResult, clearGraphResults } = useKnowledgeGraphState();
  const [searchTerm, setSearchTerm] = useState('');
  const [elements, setElements] = useState<ElementDefinition[]>([]);

  const knowledgeGraphQueryClient = useMemo(() => {
    return createKnowledgeGraphQueryClient(kgDataSource, setQueryResult);
  }, [kgDataSource, setQueryResult]);

  const onSearchClicked = useCallback(() => {
    if (searchTerm) {
      knowledgeGraphQueryClient.findEntitiesByName(searchTerm);
    }
  }, [knowledgeGraphQueryClient, searchTerm]);

  const onExploreClicked = useCallback(() => {
    if (selectedGraphNodeEntityId) {
      knowledgeGraphQueryClient.findRelatedEntities(selectedGraphNodeEntityId, MAX_NUMBER_HOPS);
    }
  }, [selectedGraphNodeEntityId, knowledgeGraphQueryClient]);

  const onClearClicked = useCallback(() => {
    clearGraphResults(true);
  }, [clearGraphResults]);

  useEffect(() => {
    if (queryResult) {
      const { nodeData, edgeData } = ResponseParser.parse(queryResult['rows'], queryResult['columnDescriptions']);
      setElements(getElementsDefinition([...nodeData.values()], [...edgeData.values()]));
    } else {
      setElements([]);
      setSearchTerm('');
    }
  }, [queryResult]);
  return (
    <Container header={<Header variant='h3'>Knowledge Graph</Header>}>
      <SpaceBetween direction='vertical' size='s'>
        <SpaceBetween direction='horizontal' size='s'>
          <Input
            type='text'
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.detail.value);
            }}
          ></Input>
          <Button onClick={onSearchClicked}>
            {/* eventually will move to auto-generated IDs */}
            <FormattedMessage
              id='KnowledgeGraphPanel.button.search'
              defaultMessage='Search'
              description='Search button text'
            />
          </Button>
        </SpaceBetween>
        {/* inline styling here for testing only this will be fixed in the next PR */}
        <Graph elements={elements} style={{ width: '1000px', height: '1000px' }} />
        <SpaceBetween direction='horizontal' size='s'>
          <Button disabled={selectedGraphNodeEntityId ? false : true} onClick={onExploreClicked}>
            <FormattedMessage
              id='KnowledgeGraphPanel.button.explore'
              defaultMessage='Explore'
              description='Explore button text'
            />
          </Button>
          {queryResult ? (
            <Button onClick={onClearClicked}>Clear</Button>
          ) : (
            <Button disabled onClick={onClearClicked}>
              <FormattedMessage
                id='KnowledgeGraphPanel.button.clear'
                defaultMessage='Clear'
                description='Clear button text'
              />
            </Button>
          )}
        </SpaceBetween>
      </SpaceBetween>
    </Container>
  );
};
export const KnowledgeGraph: React.FC<KnowledgeGraphInterface> = (props) => {
  return (
    <StateManager>
      {/* For the moment we're setting it to a fixed language,
      later we will determine the user's locale by evaluating the language request sent by the browser */}
      <IntlProvider locale='en' defaultLocale='en'>
        <KnowledgeGraphContainer {...props} />
      </IntlProvider>
    </StateManager>
  );
};
