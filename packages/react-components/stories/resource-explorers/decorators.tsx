import { type DecoratorFn } from '@storybook/react';
import { useEffect, useState } from 'react';
import { resourceExplorerQueryClient } from '../../src/components/resource-explorers/requests';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const StoryWithTanstackDevTools: DecoratorFn = (Story) => {
  return (
    <>
      <Story />
      <ReactQueryDevtools client={resourceExplorerQueryClient} />
    </>
  );
};

export const StoryWithClearedResourceCache: DecoratorFn = (Story) => {
  useEffect(() => {
    resourceExplorerQueryClient.clear();
  }, []);

  return <Story />;
};

export const StoryWithSelectableResource: DecoratorFn = (Story) => {
  const [selectedResources, setSelectedResources] = useState<unknown[]>([]);

  return (
    <Story
      selectedResources={selectedResources}
      onSelectResource={setSelectedResources}
    />
  );
};
