import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import { setFeatureConfig } from '../../../common/GlobalSettings';
import { COMPOSER_FEATURES } from '../../../interfaces';

import { ItemContainer } from './ItemContainer';
import { type ToolbarItemOptions } from './types';

describe('ItemContainer', () => {
  const onClick = jest.fn();
  const onKeyDown = jest.fn();
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
          {
            label: 'item6',
            text: 'item6 text',
            uuid: 'item6-uuid',
            isDisabled: true,
          },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();

    setFeatureConfig({});
  });

  it('should render selected item properly with custom menuHeight', () => {
    const { container, getByTestId } = render(
      <ItemContainer
        item={{ ...baseItem, isSelected: true }}
        type='action-select'
        menuHeight='100px'
        isVertical={true}
      />,
    );
    const item = getByTestId(baseItem.uuid);
    expect(item.getAttribute('height')).toEqual('100px');
    expect(container).toMatchSnapshot();
  });

  it('should render properly when horizontal', async () => {
    let container: HTMLElement | undefined;
    await act(async () => {
      const rendered = render(
        <ItemContainer item={{ ...baseItem }} type='action-select' onItemClick={onClick} isVertical={false} />,
      );
      container = rendered.container;
    });
    expect(container).toMatchSnapshot();
  });

  it('should render properly and trigger onClick when clicking on item', () => {
    const { container } = render(
      <ItemContainer item={baseItem} type='action-select' onItemClick={onClick} isVertical={true} />,
    );
    expect(container).toMatchSnapshot();

    fireEvent.pointerUp(screen.getByTestId(baseItem.uuid));

    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith(baseItem);
  });

  it('should render properly and trigger onClick when clicking on sub item', () => {
    const { container } = render(
      <ItemContainer item={itemWithSubItems} type='action-select' onItemClick={onClick} isVertical={true} />,
    );
    expect(container).toMatchSnapshot();

    fireEvent.pointerUp(screen.getByTestId('item5-uuid'));

    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toBeCalledWith(itemWithSubItems.subItems![1].subItems![1]);
  });

  it('should trigger onKeyDown when keyboard navigating on sub item', () => {
    render(
      <ItemContainer
        item={itemWithSubItems}
        type='action-select'
        onItemKeyDown={onKeyDown}
        onItemClick={onClick}
        isVertical={true}
      />,
    );

    fireEvent.keyDown(screen.getByTestId('item5-uuid'), { key: 'Enter' });
    expect(onKeyDown).toBeCalledTimes(1);

    fireEvent.keyDown(screen.getByTestId('item6-uuid'), { key: 'Enter' });
  });

  it('should not trigger onKeyDown if item is disabled', () => {
    render(
      <ItemContainer
        item={itemWithSubItems}
        type='action-select'
        onItemKeyDown={onKeyDown}
        onItemClick={onClick}
        isVertical={true}
      />,
    );

    fireEvent.keyDown(screen.getByTestId('item6-uuid'), { key: 'Enter' });
    expect(onKeyDown).toBeCalledTimes(0);
  });

  it('should not render when feature is not enabled', () => {
    const { container } = render(
      <ItemContainer
        item={{ ...baseItem, feature: { name: COMPOSER_FEATURES.FOR_TESTS } }}
        type='action-select'
        isVertical={true}
      />,
    );
    expect(container).toMatchInlineSnapshot('<div />');
  });

  it('should render when feature is enabled', () => {
    setFeatureConfig({ [COMPOSER_FEATURES.FOR_TESTS]: true });

    const { container } = render(
      <ItemContainer
        item={{ ...baseItem, feature: { name: COMPOSER_FEATURES.FOR_TESTS } }}
        type='action-select'
        isVertical={true}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
