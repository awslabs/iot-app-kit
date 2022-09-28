/* eslint-disable import/first */
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { RelatedTable } from '@iot-app-kit/related-table';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import SceneHierarchyPanel from '../../../src/components/panels/SceneHierarchyPanel/SceneHierarchyPanel.C';

const state = {
  document: {
    nodeMap: {},
    rootNodeRefs: ['ref1'],
  },
  setCameraTarget: jest.fn(),
  isViewing: jest.fn(),
  getSceneNodeByRef: jest
    .fn()
    .mockReturnValueOnce({ ref: 'nodeRef' })
    .mockReturnValueOnce({ ref: 'nodeRef2' })
    .mockReturnValueOnce({ ref: 'nodeRef3' }),
  selectedSceneNodeRef: 'selectedNodeRef',
  setSelectedSceneNodeRef: jest.fn(),
};

const threeCollection = {
  expandNode: jest.fn(),
  items: [],
  collectionProps: { ref: 'ref1' },
};

let mockedUseStore = null;

jest.mock('../../../src/store/Store', () => {
  const originalModule = jest.requireActual('../../../src/store/Store');
  return {
    __esModule: true,
    ...originalModule,
    useStore: jest.fn().mockImplementation(() => mockedUseStore),
  };
});

jest.mock('@iot-app-kit/related-table', () => {
  const originalModule = jest.requireActual('@iot-app-kit/related-table');
  return {
    __esModule: true,
    ...originalModule,
    RelatedTable: 'RelatedTable',
    useTreeCollection: jest.fn().mockImplementation(() => threeCollection),
  };
});

let container = null;

beforeEach(() => {
  mockedUseStore = jest
    .fn()
    .mockImplementationOnce(() => state.document.nodeMap)
    .mockImplementationOnce(() => state.document.rootNodeRefs)
    .mockImplementationOnce(() => state.setCameraTarget)
    .mockImplementationOnce(() => state.isViewing)
    .mockImplementationOnce(() => state.getSceneNodeByRef)
    .mockImplementationOnce(() => state.selectedSceneNodeRef)
    .mockImplementationOnce(() => state.setSelectedSceneNodeRef) as any;
  container = document.createElement('div') as any;
  document.body.appendChild(container as any);
});

afterEach(() => {
  unmountComponentAtNode(container as any);
  (container as any).remove();
  container = null;
});

configure({ adapter: new Adapter() });
describe('SceneHierarchyPanel renders correctly.', () => {
  it('Return expected related table.', async () => {
    const wrapper = shallow(<SceneHierarchyPanel />);

    const relatedTableProps = wrapper.find(RelatedTable).props();
    const selectionChangeEvent = {
      detail: {
        selectedItems: [{ nodeRef: 'nodeRef' }],
      },
    };
    relatedTableProps.onSelectionChange(selectionChangeEvent);

    expect(state.setSelectedSceneNodeRef).toBeCalledTimes(1);
    expect(state.setSelectedSceneNodeRef.mock.calls[0][0]).toEqual('nodeRef');

    relatedTableProps.expandChildren({ nodeRef: 'nodeRef' });
    expect(threeCollection.expandNode).toBeCalledTimes(1);
    expect(threeCollection.expandNode.mock.calls[0][0]).toEqual({ nodeRef: 'nodeRef' });

    const columnDefinitions = relatedTableProps.columnDefinitions[0];

    expect(columnDefinitions.id).toEqual('name');
    expect(columnDefinitions.header).toEqual('Name');

    const clickableDiv = columnDefinitions.cell({ nodeRef: 'nodeRef' });
    state.isViewing.mockReturnValue(true);
    clickableDiv.props.onClick({ stopPropagation: jest.fn() });

    expect(state.setCameraTarget.mock.calls[0][0]).toEqual('nodeRef');
    expect(state.setSelectedSceneNodeRef.mock.calls[0][0]).toEqual('nodeRef');

    state.isViewing.mockReturnValue(false);
    clickableDiv.props.onDoubleClick({ stopPropagation: jest.fn() });
    expect(state.setSelectedSceneNodeRef.mock.calls[0][0]).toEqual('nodeRef');
    expect(state.setCameraTarget.mock.calls[0][0]).toEqual('nodeRef');
  });

  it('useEffect is called when SceneHierarchyPanel is mounted.', async () => {
    jest.resetModules();
    act(() => {
      render(<SceneHierarchyPanel />, container);
    });

    expect(state.getSceneNodeByRef).toBeCalled();
  });
});
