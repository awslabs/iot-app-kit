import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import { setFeatureConfig } from '../../../common/GlobalSettings';
import { COMPOSER_FEATURES } from '../../../interfaces';

import { ItemContainer } from './ItemContainer';
import { ToolbarItemOptions } from './types';

describe('ItemContainer', () => {
  const onClick = jest.fn();
  const baseItem: ToolbarItemOptions = {
    label: 'item1',
    uuid: 'item1-uuid',
  };

  const itemWithSubItems: ToolbarItemOptions = {
    label: 'item1',
    text: 'item1 text',
    icon: { name: 'add-plus' },
    uuid: 'item1-uuid',
    subItems: [
      {
        label: 'item2',
        text: 'item2 text',
        icon: { name: 'add-plus' },
        uuid: 'item2-uuid',
      },
      {
        label: 'item3',
        text: 'item3 text',
        uuid: 'item3-uuid',
        subItems: [
          {
            label: 'item4',
            text: 'item4 text',
            uuid: 'item4-uuid',
            isSelected: true,
          },
          {
            label: 'item5',
            text: 'item5 text',
            uuid: 'item5-uuid',
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    setFeatureConfig({});
  });

  it('should render properly and trigger onClick when clicking on item', () => {
    const { container } = render(<ItemContainer item={baseItem} type='action-select' onItemClick={onClick} />);
    expect(container).toMatchSnapshot();

    fireEvent.pointerUp(screen.getByTestId(baseItem.uuid));

    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith(baseItem);
  });

  it('should render properly and trigger onClick when clicking on sub item', () => {
    const { container } = render(<ItemContainer item={itemWithSubItems} type='action-select' onItemClick={onClick} />);
    expect(container).toMatchSnapshot();

    fireEvent.pointerUp(screen.getByTestId('item5-uuid'));

    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith(itemWithSubItems.subItems![1].subItems![1]);
  });

  it('should not render when feature is not enabled', () => {
    const { container } = render(
      <ItemContainer item={{ ...baseItem, feature: { name: COMPOSER_FEATURES.FOR_TESTS } }} type='action-select' />,
    );
    expect(container).toMatchInlineSnapshot('<div />');
  });

  it('should render when feature is enabled', () => {
    setFeatureConfig({ [COMPOSER_FEATURES.FOR_TESTS]: true });

    const { container } = render(
      <ItemContainer item={{ ...baseItem, feature: { name: COMPOSER_FEATURES.FOR_TESTS } }} type='action-select' />,
    );
    expect(container).toMatchSnapshot();
  });
});
