/* eslint-disable import/first */
import renderer from 'react-test-renderer';
import React from 'react';

// eslint-disable-next-line import/order
import { mockPolaris } from '../../../__mocks__/MockPolaris';

mockPolaris();

import FoldableContainer from '../../../../src/layouts/scene-layout/components/FoldableContainer';
import { Direction } from '../../../../src/layouts/scene-layout';

describe('FoldableContainerSnap', () => {
  it('should render a left fold correctly', () => {
    const container = renderer.create(<FoldableContainer direction={Direction.Left}>My Content</FoldableContainer>);
    expect(container).toMatchSnapshot();
  });
  it('should render a right fold correctly', () => {
    const container = renderer.create(<FoldableContainer direction={Direction.Right}>My Content</FoldableContainer>);
    expect(container).toMatchSnapshot();
  });
});
