/* eslint-disable import/first */
/* eslint-disable import/order */
import React from 'react';
import renderer, { act } from 'react-test-renderer';

const showPanel = jest.fn();

jest.doMock('three/examples/js/libs/stats.min', () => {
  return jest.fn().mockReturnValue({
    showPanel,
    dom: document.createElement('div'),
    begin: jest.fn(),
    end: jest.fn(),
  });
});

import StatsImpl from 'three/examples/js/libs/stats.min';
import { StatsWindow } from '../../../src/components/three-fiber/StatsWindow';

describe('StatsWindow', () => {
  it('should call StatsImpl Dependencies', () => {
    act(() => {
      renderer.create(<StatsWindow />);
    });

    expect(StatsImpl).toBeCalled();
    expect(showPanel).toBeCalledWith(0);
  });
});
