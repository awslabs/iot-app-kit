import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { unmountComponentAtNode } from 'react-dom';
import { shallow, configure } from 'enzyme';
import { MathUtils } from 'three';

import { ViewpointComponentEditor } from '../../../../src/components/panels/scene-components/ViewpointComponentEditor';
import { Matrix3XInputGrid } from '../../../../src/components/panels/CommonPanelComponents';

import { mockNode } from './MockComponents';

let container = null;

beforeEach(() => {
  container = document.createElement('div') as any;
  document.body.appendChild(container as any);
});

afterEach(() => {
  unmountComponentAtNode(container as any);
  (container as any).remove();
  container = null;
});

configure({ adapter: new Adapter() });
describe('render viewpoint component editor correctly.', () => {
  it('render sixSided viewpoint component correctly.', async () => {
    const sixSidedViewpointComponent = {
      ref: 'ref',
      type: 'Viewpoint',
      skyboxImages: ['image1', 'image2', 'image3', 'image4', 'image5', 'image6'],
      cameraPosition: [1, 2, 3],
      skyboxImageFormat: 'SixSided',
      cameraRotation: [1, 1, 2],
    };

    const wrapper = shallow(<ViewpointComponentEditor node={mockNode} component={sixSidedViewpointComponent} />);

    const renderedImages = wrapper.find('div');
    expect(renderedImages.length).toBe(12);

    expect(renderedImages.at(0).props().children).toBe('Left:');
    expect(renderedImages.at(1).props().children).toBe('image2');
    expect(renderedImages.at(2).props().children).toBe('Right:');
    expect(renderedImages.at(3).props().children).toBe('image1');
    expect(renderedImages.at(4).props().children).toBe('Top:');
    expect(renderedImages.at(5).props().children).toBe('image3');
    expect(renderedImages.at(6).props().children).toBe('Bottom:');
    expect(renderedImages.at(7).props().children).toBe('image4');
    expect(renderedImages.at(8).props().children).toBe('Front:');
    expect(renderedImages.at(9).props().children).toBe('image5');
    expect(renderedImages.at(10).props().children).toBe('Back:');
    expect(renderedImages.at(11).props().children).toBe('image6');

    const renderedCameraPostionRotation = wrapper.find(Matrix3XInputGrid);
    expect(renderedCameraPostionRotation.length).toBe(2);
    expect(renderedCameraPostionRotation.at(0).props().name).toEqual('Camera position');
    expect(renderedCameraPostionRotation.at(0).props().values).toEqual([1, 2, 3]);
    expect(renderedCameraPostionRotation.at(1).props().name).toEqual('Camera rotation');
    expect(renderedCameraPostionRotation.at(1).props().values).toEqual([
      MathUtils.radToDeg(1),
      MathUtils.radToDeg(1),
      MathUtils.radToDeg(2),
    ]);
  });

  it('render nonSixSided viewpoint component correctly.', async () => {
    const sixSidedViewpointComponent = {
      ref: 'ref',
      type: 'Viewpoint',
      skyboxImages: ['image1'],
      cameraPosition: [1, 2, 3],
      skyboxImageFormat: 'CubeMap',
      cameraRotation: [1, 1, 2],
    };

    const wrapper = shallow(<ViewpointComponentEditor node={mockNode} component={sixSidedViewpointComponent} />);

    const renderedImages = wrapper.find('div');
    expect(renderedImages.length).toBe(2);

    expect(renderedImages.at(0).props().children).toBe('Image:');
    expect(renderedImages.at(1).props().children).toBe('image1');

    const renderedCameraPostionRotation = wrapper.find(Matrix3XInputGrid);
    expect(renderedCameraPostionRotation.length).toBe(2);
    expect(renderedCameraPostionRotation.at(0).props().name).toEqual('Camera position');
    expect(renderedCameraPostionRotation.at(0).props().values).toEqual([1, 2, 3]);
    expect(renderedCameraPostionRotation.at(1).props().name).toEqual('Camera rotation');
    expect(renderedCameraPostionRotation.at(1).props().values).toEqual([
      MathUtils.radToDeg(1),
      MathUtils.radToDeg(1),
      MathUtils.radToDeg(2),
    ]);
  });
});
