import { render, fireEvent } from '@testing-library/react';
import React, { useRef, useState } from 'react';

import TreeItem, { TreeItemProps } from './TreeItem';

jest.mock('react-dnd', () => ({
  useDrag: jest.fn(() => [1, useRef(2)]),
  useDrop: jest.fn(() => [1, useRef(2)]),
}));

describe('<TreeItem />', () => {
  (
    [
      { labelText: '', selected: false, expandable: false },
      { labelText: null, selected: false, expandable: false },
      { labelText: 'Label 1', selected: false, expandable: false },
      { labelText: <span>Label</span>, selected: false, expandable: false },
      { labelText: 'Label', selected: true, expandable: false },
      { labelText: 'Label', selected: false, expandable: true },
      { labelText: 'Label', selected: true, expandable: true },
    ] as TreeItemProps[]
  ).forEach((props) => {
    it(`should render appropriate configuration "${JSON.stringify(props)}"`, () => {
      const { container } = render(<TreeItem {...props}>Item</TreeItem>);
      expect(container).toMatchSnapshot();
    });
  });

  it(`should activate on double click`, () => {
    const onActivated = jest.fn();

    const { container } = render(<TreeItem labelText={'Click me'} onActivated={onActivated} />);
    const target = container.querySelector('.tm-tree-item-inner');

    expect(target).not.toBeNull();

    if (target) {
      fireEvent.doubleClick(target);
      expect(onActivated).toBeCalled();
    }
  });

  it(`should expand when the expand button is clicked`, () => {
    const DummyTreeItem = () => {
      const [expand, setExpand] = useState(false);

      return (
        <TreeItem expandable onExpand={setExpand} expanded={expand} labelText={'I am expandable'}>
          <div data-testid={'hidden-section'}>I should only exist when expanded</div>
        </TreeItem>
      );
    };

    const { container } = render(<DummyTreeItem />);

    const expander = container.querySelector('[iconname="treeview-expand"]');
    expect(expander).not.toBeNull();

    if (expander) {
      fireEvent.click(expander);

      // Expanded view...
      expect(container).toMatchInlineSnapshot(`
        <div>
          <li
            class="tm-tree-item expandable"
            role="treeitem"
          >
            <div
              aria-selected="false"
              class="tm-tree-item-inner"
            >
              <div
                data-mocked="Checkbox"
              >
                <div
                  data-mocked="Button"
                  iconname="treeview-collapse"
                  variant="inline-icon"
                />
                I am expandable
              </div>
            </div>
            <div
              data-testid="hidden-section"
            >
              I should only exist when expanded
            </div>
          </li>
        </div>
      `);
    }
  });

  it(`should show selected when the checkbox is checked`, () => {
    const DummyTreeItem = () => {
      const [selected, setSelected] = useState(false);

      return (
        <TreeItem
          expandable
          onSelected={setSelected}
          selected={selected}
          labelText={`I am ${selected ? 'selected' : 'not selected'}`}
        />
      );
    };

    const { container } = render(<DummyTreeItem />);

    const selector = container.querySelector('.tm-tree-item-inner');

    expect(selector).not.toBeNull();

    if (selector) {
      fireEvent.click(selector);

      // Expanded view...
      expect(container).toMatchInlineSnapshot(`
        <div>
          <li
            class="tm-tree-item expandable"
            role="treeitem"
          >
            <div
              aria-selected="true"
              class="tm-tree-item-inner selected"
            >
              <div
                data-mocked="Checkbox"
              >
                <div
                  data-mocked="Button"
                  iconname="treeview-expand"
                  variant="inline-icon"
                />
                I am selected
              </div>
            </div>
          </li>
        </div>
      `);
    }
  });
});
