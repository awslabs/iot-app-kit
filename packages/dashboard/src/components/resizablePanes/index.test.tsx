import { render } from '@testing-library/react';
import { type PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { configureDashboardStore } from '~/store';
import { initialState } from '~/store/state';
import { PropertiesPaneIcon } from './assets/propertiesPaneIcon';
import { ResizablePanes } from './index';

const leftPaneContent = `Warp core monitor`;
const centerPaneContent = `Forward viewscreen`;
const rightPaneContent = `Phaser controls`;

const TestProvider = ({ children }: PropsWithChildren) => (
  <Provider store={configureDashboardStore(initialState)}>{children}</Provider>
);

it('renders panes', () => {
  const { container } = render(
    <TestProvider>
      <ResizablePanes
        leftPane={<p>{leftPaneContent}</p>}
        centerPane={<p>{centerPaneContent}</p>}
        rightPane={<p>{rightPaneContent}</p>}
        rightPaneOptions={{
          icon: <PropertiesPaneIcon role='img' ariaLabel='' />,
          headerText: 'Configuration',
        }}
      />
    </TestProvider>
  );

  const paraEls = container.querySelectorAll('p');
  expect(paraEls[0].textContent).toEqual(leftPaneContent);
  expect(paraEls[1].textContent).toEqual(centerPaneContent);
  expect(paraEls.length).toEqual(2);
});
