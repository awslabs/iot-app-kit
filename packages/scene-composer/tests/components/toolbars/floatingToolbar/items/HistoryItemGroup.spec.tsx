/* eslint-disable import/first */
import React from 'react';
import renderer, { act } from 'react-test-renderer';

import { mockReactIntl } from '../../../../__mocks__/MockReactIntl';
mockReactIntl();
import { ToolbarItem } from '../../../../../src/components/toolbars/common/ToolbarItem';
import { HistoryItemGroup } from '../../../../../src/components/toolbars/floatingToolbar/items';

jest.mock('../../../../../src/components/toolbars/common/ToolbarItem', () => ({
  ToolbarItem: 'ToolbarItem',
}));

describe('HistoryItemGroup', () => {
  it('should render correctly', () => {
    let container;
    act(() => {
      container = renderer.create(<HistoryItemGroup />);
    });
    expect(container).toMatchSnapshot();
  });
});
