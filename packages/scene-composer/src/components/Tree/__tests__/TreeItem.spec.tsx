import { render, fireEvent } from '@testing-library/react';
import { useRef, useState } from 'react';

import TreeItem, { type TreeItemProps } from '../TreeItem';
import SceneNodeLabel from '../../panels/SceneHierarchyPanel/components/SceneHierarchyTree/SceneNodeLabel';

jest.mock('react-dnd', () => ({
  useDrag: jest.fn(() => [1, useRef(2)]),
  useDrop: jest.fn(() => [1, useRef(2)]),
}));

jest.mock('../../panels/SceneHierarchyPanel/components/SceneHierarchyTree/SceneNodeLabel', () => (props) => (
  <div data-mocked='SceneNodeLabel'>{JSON.stringify(props)}</div>
));

const mockSceneNodeLabel = ({ label }) => <SceneNodeLabel objectRef='' labelText={label} componentTypes={['']} />;

describe('<TreeItem />', () => {
  (
    [
      { labelNode: mockSceneNodeLabel({ label: '' }), labelText: '', selected: false, expandable: false },
      { labelNode: mockSceneNodeLabel({ label: 'Label 1' }), labelText: 'Label 1', selected: false, expandable: false },
      { labelNode: mockSceneNodeLabel({ label: 'Label' }), labelText: 'Label', selected: false, expandable: false },
      { labelNode: mockSceneNodeLabel({ label: 'Label' }), labelText: 'Label', selected: true, expandable: false },
      { labelNode: mockSceneNodeLabel({ label: 'Label' }), labelText: 'Label', selected: false, expandable: true },
      { labelNode: mockSceneNodeLabel({ label: 'Label' }), labelText: 'Label', selected: true, expandable: true },
    ] as TreeItemProps[]
  ).forEach((props) => {
    it(`should render appropriate configuration "${JSON.stringify(props)}"`, () => {
      const { container } = render(<TreeItem {...props}>Item</TreeItem>);
      expect(container).toMatchSnapshot();
    });
  });

  it(`should activate on double click`, () => {
    const onActivated = jest.fn();

    const { container } = render(
      <TreeItem labelNode={mockSceneNodeLabel({ label: 'Click me' })} labelText='Click me' onActivated={onActivated} />,
    );
    const target = container.querySelector('.tm-tree-item-inner') as Element;

    fireEvent.doubleClick(target);
    expect(onActivated).toBeCalled();
  });

  it(`should select on click`, () => {
    const onSelected = jest.fn();

    const { container } = render(
      <TreeItem labelNode={mockSceneNodeLabel({ label: 'Click me' })} labelText='Click me' onSelected={onSelected} />,
    );
    const target = container.querySelector('.tm-tree-item-inner') as Element;

    fireEvent.click(target);
    expect(onSelected).toBeCalled();
  });

  it('should expand when the expand button is clicked', () => {
    const DummyTreeItem = () => {
      const [expand, setExpand] = useState(false);

      return (
        <TreeItem
          expandable
          onExpand={setExpand}
          expanded={expand}
          labelNode={mockSceneNodeLabel({ label: 'I am expandable' })}
          labelText='I am expandable'
        >
          <div data-testid='hidden-section'>I should only exist when expanded</div>
        </TreeItem>
      );
    };

    const { container } = render(<DummyTreeItem />);

    const expander = container.querySelector('[iconname="treeview-expand"]') as Element;
    fireEvent.click(expander);

    // Expanded view...
    expect(container).toMatchInlineSnapshot(`
      <div>
        <li
          class="tm-tree-item expandable"
          role="treeitem"
        >
          <label
            aria-selected="false"
            class="tm-tree-item-inner"
          >
            <input
              type="radio"
              value="I am expandable"
            />
            <div
              arialabel="Collapse I am expandable"
              class="tm-tree-item-expand-btn"
              data-mocked="Button"
              iconname="treeview-collapse"
              variant="inline-icon"
            />
            <div
              data-mocked="SceneNodeLabel"
            >
              {"objectRef":"","labelText":"I am expandable","componentTypes":[""]}
            </div>
          </label>
          <div
            data-testid="hidden-section"
          >
            I should only exist when expanded
          </div>
        </li>
      </div>
    `);
  });

  it(`should show selected when the radio button is selected`, () => {
    const DummyTreeItem = () => {
      const [selected, setSelected] = useState(false);

      return (
        <TreeItem
          expandable
          onSelected={() => setSelected(!selected)}
          selected={selected}
          labelNode={mockSceneNodeLabel({ label: `${selected ? 'selected' : 'not selected'}` })}
          labelText={`${selected ? 'selected' : 'not selected'}`}
        />
      );
    };

    const { container } = render(<DummyTreeItem />);

    const selector = container.querySelector('.tm-tree-item-inner') as Element;

    fireEvent.click(selector);

    // Expanded view...
    expect(container).toMatchInlineSnapshot(`
      <div>
        <li
          class="tm-tree-item expandable"
          role="treeitem"
        >
          <label
            aria-selected="true"
            class="tm-tree-item-inner selected"
          >
            <input
              type="radio"
              value="selected"
            />
            <div
              arialabel="Expand selected"
              class="tm-tree-item-expand-btn"
              data-mocked="Button"
              iconname="treeview-expand"
              variant="inline-icon"
            />
            <div
              data-mocked="SceneNodeLabel"
            >
              {"objectRef":"","labelText":"selected","componentTypes":[""]}
            </div>
          </label>
        </li>
      </div>
    `);
  });

  it('should select when children are null', () => {
    const DummyTreeItem = () => {
      const [selected, setSelected] = useState(false);

      return (
        <TreeItem
          children={null}
          onSelected={() => setSelected(!selected)}
          selected={selected}
          labelNode={mockSceneNodeLabel({ label: `${selected ? 'selected' : 'not selected'}` })}
          labelText={`${selected ? 'selected' : 'not selected'}`}
        />
      );
    };

    const { container } = render(<DummyTreeItem />);

    const selector = container.querySelector('.tm-tree-item-inner') as Element;

    fireEvent.click(selector);

    // Expanded view...
    expect(container).toMatchInlineSnapshot(`
      <div>
        <li
          class="tm-tree-item"
          role="treeitem"
        >
          <label
            aria-selected="true"
            class="tm-tree-item-inner selected"
          >
            <input
              type="radio"
              value="selected"
            />
            <div
              data-mocked="SceneNodeLabel"
            >
              {"objectRef":"","labelText":"selected","componentTypes":[""]}
            </div>
          </label>
        </li>
      </div>
    `);
  });
});
