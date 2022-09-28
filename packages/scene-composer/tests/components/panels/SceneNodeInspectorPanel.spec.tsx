/* eslint-disable import/first */
import React from 'react';
import { shallow, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Checkbox, FormField, TextContent } from '@awsui/components-react';

import { SceneNodeInspectorPanel } from '../../../src/components/panels/SceneNodeInspectorPanel';
import { Matrix3XInputGrid, ExpandableInfoSection } from '../../../src/components/panels/CommonPanelComponents';
import { KnownComponentType } from '../../../src/interfaces';
import { Component } from '../../../src/models/SceneModels';

const getSceneNodeByRef = jest.fn();
const updateSceneNodeInternal = jest.fn();

jest.mock('../../../src/store/Store', () => {
  const originalModule = jest.requireActual('../../../src/store/Store');
  return {
    __esModule: true,
    ...originalModule,
    useEditorState: jest.fn().mockReturnValue({ selectedSceneNodeRef: 'testNodeRef' }),
    useSceneDocument: jest.fn(() => ({
      getSceneNodeByRef: getSceneNodeByRef,
      updateSceneNodeInternal: updateSceneNodeInternal,
    })),
  };
});

jest.mock('../../../src/three/transformUtils', () => {
  const originalModule = jest.requireActual('../../../src/three/transformUtils');
  return {
    __esModule: true,
    ...originalModule,
    useSnapObjectToFloor: jest.fn(),
  };
});

configure({ adapter: new Adapter() });
describe('SceneNodeInspectorPanel returns expected elements.', () => {
  it('SceneNode panel contains expected elements when none selected scene node.', async () => {
    getSceneNodeByRef.mockReset();
    getSceneNodeByRef.mockReturnValue(null);
    const wrapper = shallow(<SceneNodeInspectorPanel />);

    const expandableInfoSectionProps = wrapper.find(ExpandableInfoSection).props();

    expect(expandableInfoSectionProps.title).toEqual('Properties');

    const textContentProps = wrapper.find(TextContent).props();
    expect(textContentProps.children.props.children).toEqual('No node selected.');
  });

  it('SceneNode panel contains expected elements when selected scene node.', async () => {
    getSceneNodeByRef.mockReset();
    updateSceneNodeInternal.mockReset();
    getSceneNodeByRef.mockReturnValue({
      components: [
        {
          type: KnownComponentType.ModelRef,
        },
      ],
      transform: {
        position: [1, 1, 1],
        rotation: [0, 0, 0],
        scale: [2, 2, 2],
      },
      transformConstraint: {
        snapToFloor: true,
      },
    });

    const wrapper = shallow(<SceneNodeInspectorPanel />);

    const expandableInfoSection0Props = wrapper.find(ExpandableInfoSection).at(0).props();
    expect(expandableInfoSection0Props.title).toEqual('Properties');

    const formField0Props = wrapper.find(ExpandableInfoSection).at(0).find(FormField).props();
    expect(formField0Props.label).toEqual('Name');
    formField0Props.children.props.onChange({
      detail: {
        value: 'changedValue',
      },
    });
    expect(updateSceneNodeInternal).toBeCalledTimes(1);

    const expandableInfoSection1Props = wrapper.find(ExpandableInfoSection).at(1).props();
    expect(expandableInfoSection1Props.title).toEqual('Transform');

    const matrixInputGrids = wrapper.find(ExpandableInfoSection).at(1).find(Matrix3XInputGrid);
    expect(matrixInputGrids.length).toBe(3);

    const matrixInputGrid0Props = matrixInputGrids.at(0).props();
    expect(matrixInputGrid0Props.name).toEqual('Position');
    expect(matrixInputGrid0Props.values).toEqual([1, 1, 1]);
    await matrixInputGrid0Props.onChange([2, 1, 2]);

    const matrixInputGrid1Props = matrixInputGrids.at(1).props();
    expect(matrixInputGrid1Props.name).toEqual('Rotation');
    expect(matrixInputGrid1Props.values).toEqual([0, 0, 0]);
    await matrixInputGrid1Props.onChange([2, 1, 2]);

    const matrixInputGrid2Props = matrixInputGrids.at(2).props();
    expect(matrixInputGrid2Props.name).toEqual('Scale');
    expect(matrixInputGrid2Props.values).toEqual([2, 2, 2]);
    await matrixInputGrid2Props.onChange([2, 1, 2]);

    // assert there is form field and check box
    const formField = wrapper.find(ExpandableInfoSection).at(1).find(FormField);
    expect(formField.props().label).toEqual('Constraints');
    const checkBox = formField.find(Checkbox);
    expect(checkBox.props().checked).toBe(true);

    const expandableInfoSection2Props = wrapper.find(ExpandableInfoSection).at(2).props();
    expect(expandableInfoSection2Props.title).toEqual('Model Reference');
  });

  it('disable y scale when selected scene node is LinearPlane motion indicator.', async () => {
    getSceneNodeByRef.mockReset();
    updateSceneNodeInternal.mockReset();
    getSceneNodeByRef.mockReturnValue({
      components: [
        {
          type: KnownComponentType.MotionIndicator,
          shape: Component.MotionIndicatorShape.LinearPlane,
        },
      ],
      transform: {
        position: [1, 1, 1],
        rotation: [0, 0, 0],
        scale: [2, 2, 2],
      },
      transformConstraint: {
        snapToFloor: false,
      },
    });

    const wrapper = shallow(<SceneNodeInspectorPanel />);

    const matrixInputGrids = wrapper.find(ExpandableInfoSection).at(1).find(Matrix3XInputGrid);
    expect(matrixInputGrids.length).toBe(3);

    const matrixInputGrid2Props = matrixInputGrids.at(2).props();
    expect(matrixInputGrid2Props.name).toEqual('Scale');
    expect(matrixInputGrid2Props.values).toEqual([2, 2, 2]);
    expect(matrixInputGrid2Props.disabled).toEqual([false, true, false]);
    await matrixInputGrid2Props.onChange([2, 1, 2]);

    const expandableInfoSection2Props = wrapper.find(ExpandableInfoSection).at(2).props();
    expect(expandableInfoSection2Props.title).toEqual('Motion Indicator');
  });
});
