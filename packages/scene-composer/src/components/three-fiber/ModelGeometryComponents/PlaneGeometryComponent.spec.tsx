import React from 'react';
import { render } from '@testing-library/react';

import { KnownComponentType } from '../../../interfaces';
import { IPlaneGeometryComponentInternal } from '../../../store';
import { mockNode, mockComponent } from '../../../../tests/components/panels/scene-components/MockComponents';

import PlaneGeometryComponent from './PlaneGeometryComponent';

jest.doMock('../../../utils/objectThreeUtils', () => {
  return {
    acceleratedRaycasting: jest.fn(),
  };
});

const handleAddWidgetMock = jest.fn();
jest.doMock('../../../hooks/useAddWidget', () => {
  return {
    handleAddWidget: handleAddWidgetMock,
  };
});

describe('PlaneGeometryComponent', () => {
  const component: IPlaneGeometryComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.PlaneGeometry,
    width: 10,
    height: 20,
  };

  const componentWithColor: IPlaneGeometryComponentInternal = {
    ...mockComponent,
    type: KnownComponentType.PlaneGeometry,
    width: 10,
    height: 20,
    color: '#abcdef',
  };

  const setup = () => {
    jest.resetAllMocks();
  };

  beforeEach(() => {
    setup();
  });

  it(`should render`, async () => {
    const { container } = render(<PlaneGeometryComponent component={component} node={mockNode} />);

    expect(container).toMatchSnapshot();
  });

  it(`should render with predefined color`, () => {
    const { container } = render(<PlaneGeometryComponent component={componentWithColor} node={mockNode} />);

    expect(container).toMatchSnapshot();
  });
});
