import { type DecoratorFn } from '@storybook/react';
import { useEffect, useState } from 'react';
import { resourceExplorerQueryClient } from '../../src/components/resource-explorers/requests';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { DARK_MODE_EVENT_NAME } from 'storybook-dark-mode';
import { addons } from '@storybook/preview-api';
import { useTheme } from '../../src/hooks/useTheming';

// get channel to listen to event emitter
const channel = addons.getChannel();

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

export const StoryWithTheming: DecoratorFn = (Story) => {
  // this example uses hook but you can also use class component as well
  const [isDark, setDark] = useState(false);

  useEffect(() => {
    // listen to DARK_MODE event
    channel.on(DARK_MODE_EVENT_NAME, setDark);
    return () => channel.off(DARK_MODE_EVENT_NAME, setDark);
  }, [setDark]);

  useTheme({ mode: isDark ? 'dark' : 'light' });
  return (
    <>
      <Story />
    </>
  );
};
