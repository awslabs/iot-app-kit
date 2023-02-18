import React from 'react';
import { render, screen } from '@testing-library/react';
import { wrapWithTestBackend } from 'react-dnd-test-utils';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Provider } from 'react-redux';
import WidgetComponent, { WidgetProps } from './widget';
import { DefaultDashboardMessages } from '~/messages';
import { configureDashboardStore } from '~/store';

global.structuredClone = jest.fn((val) => {
  return JSON.parse(JSON.stringify(val));
});

const generateWidget = (props: WidgetProps) => {
  const [Widget, getBackend] = wrapWithTestBackend(WidgetComponent);

  const container = render(
    <Provider store={configureDashboardStore({})}>
      <DndProvider
        backend={TouchBackend}
        options={{
          enableMouseEvents: true,
          enableKeyboardEvents: true,
        }}
      >
        <Widget {...props} />
      </DndProvider>
    </Provider>
  );

  return { container, getBackend };
};

const textWidget = {
  id: 'test',
  componentTag: 'text',
  x: 0,
  y: 0,
  z: 0,
  height: 10,
  width: 10,
  text: 'test content',
};

const defaultProps = {
  readOnly: true,
  isSelected: true,
  cellSize: 2,
  widget: textWidget,
  widgets: [],
  viewport: { duration: '5m' },
  messageOverrides: DefaultDashboardMessages,
};

it('renders widget', () => {
  generateWidget(defaultProps);

  expect(screen.queryByText(textWidget.text)).toBeTruthy();
});

// TODO: backfill test for input widget
// const inputWidget = {
//   id: 'test',
//   componentTag: 'input',
//   x: 0,
//   y: 0,
//   z: 0,
//   height: 10,
//   width: 10,
//   properties: { options: ['Test option'] },
// }
// describe('input widget', () => {
//   it('on hover - shows error if asset property is not writable', () => {
//     generateWidget({ ...defaultProps, widget: inputWidget });
//
//     getBackend().simulateHover(queryByText('Add asset property'));
//
//     expect(screen.queryByText(`Asset is not writable. Add ${WRITABLE_TAG} tag to asset.`)).toBeTruthy();
//   });
//
//   it('on drop - does not set asset if not writable', () => {
//     const { getBackend } = generateWidget({ ...defaultProps, widget: inputWidget });
//
//     getBackend().simulateDrop();
//
//     expect(screen.queryByText('Add asset property')).toBeTruthy();
//   });
// });
