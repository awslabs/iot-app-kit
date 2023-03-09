import React from 'react';

import { render } from '@testing-library/react';
import { useSelector, useDispatch } from 'react-redux';
import TextWidgetComponent from './component';
import { useIsSelected } from '~/customization/hooks/useIsSelected';
import { onChangeDashboardGridEnabledAction } from '~/store/actions';

jest.mock('~/store/actions', () => ({
  ...jest.requireActual('~/store/actions'),
  onChangeDashboardGridEnabledAction: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

jest.mock('~/customization/hooks/useIsSelected', () => ({
  useIsSelected: jest.fn(),
}));

jest.mock('./link', () => (props: unknown) => <div data-mocked='TextLink'>{JSON.stringify(props)}</div>);
jest.mock('./link/editableLink', () => (props: unknown) => (
  <div data-mocked='EditableTextLink'>{JSON.stringify(props)}</div>
));
jest.mock('./styledText/textArea', () => (props: unknown) => (
  <div data-mocked='StyledTextArea'>{JSON.stringify(props)}</div>
));
jest.mock('./styledText/editableText', () => (props: unknown) => (
  <div data-mocked='EditableStyledText'>{JSON.stringify(props)}</div>
));
jest.mock('./styledText', () => (props: unknown) => <div data-mocked='StyledText'>{JSON.stringify(props)}</div>);

describe('Text Widget', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  [
    { readOnly: true, isSelected: true, isUrl: true },
    { readOnly: true, isSelected: true, isUrl: false },
    { readOnly: true, isSelected: false, isUrl: false },
    { readOnly: false, isSelected: false, isUrl: false },
    { readOnly: false, isSelected: false, isUrl: true },
    { readOnly: false, isSelected: true, isUrl: true },
    { readOnly: false, isSelected: true, isUrl: false },
    { readOnly: true, isSelected: false, isUrl: true },
  ].forEach((configuration) => {
    it(`should render ${JSON.stringify(configuration)} correctly`, () => {
      const { isSelected, readOnly, isUrl } = configuration;
      (useIsSelected as jest.Mock).mockImplementation(() => isSelected);
      (useSelector as jest.Mock).mockImplementation(() => readOnly);
      (useDispatch as jest.Mock).mockReturnValue(jest.fn());

      const { container } = render(
        <TextWidgetComponent
          id='some-id'
          x={1}
          y={2}
          z={3}
          height={100}
          width={100}
          type='text-widget'
          properties={{ isUrl, value: 'abc' }}
        />
      );

      expect(container).toMatchSnapshot();
    });
  });

  it('should exit edit mode when unmounted', () => {
    (useDispatch as jest.Mock).mockImplementation(() => jest.fn((cb) => cb())); // short curcuit dispatch

    (useIsSelected as jest.Mock).mockImplementation(() => false);
    (useSelector as jest.Mock).mockImplementation(() => false);
    (useDispatch as jest.Mock).mockReturnValue(jest.fn());

    const { unmount } = render(
      <TextWidgetComponent
        id='some-id'
        x={1}
        y={2}
        z={3}
        height={100}
        width={100}
        type='text-widget'
        properties={{ isUrl: false, value: 'abc' }}
      />
    );
    unmount();

    expect(onChangeDashboardGridEnabledAction).toBeCalledWith({ enabled: true });
  });
});
