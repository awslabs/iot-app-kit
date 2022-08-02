import React from 'react';
import { render } from '@testing-library/react';
import { Object3D, Event, Mesh, Color } from 'three';

import ModelExplorerTreeView, { ModelExplorerTree, ModelExplorerTreeProps } from '../ModelExplorerTreeView';
import useMaterialEffect from '../../../../hooks/useMaterialEffect';
import { useModelExplorer } from '../Context';

jest.mock('../../../../hooks/useMaterialEffect');
jest.mock('../Context');

describe('<ModelExplorerTreeView />', () => {
  it('should render as expected', () => {
    const origObj = { material: { color: 0xffffff } };
    let transformObj = { ...origObj };

    const restore = jest.fn(() => {
      transformObj = { ...origObj };
    });

    (useMaterialEffect as jest.Mock).mockImplementation((cb) => [jest.fn(() => cb(transformObj)), restore]);

    (useModelExplorer as jest.Mock).mockImplementation(() => ({
      object3D: {
        id: '1',
        name: 'root',
        children: [
          { id: '2', name: 'Level 1', children: [] },
          { id: '3', name: 'Level 1', children: [] },
          {
            id: '4',
            name: 'Level 1',
            children: [
              { id: '5', name: 'Level 2', children: [] },
              { id: '6', name: 'Level 2', children: [] },
              { id: '7', name: 'Level 2', children: [] },
            ],
          },
        ],
      },
    }));

    const { container } = render(<ModelExplorerTreeView />);
    expect(container).toMatchSnapshot();
  });

  describe('<ModelExplorerTree />', () => {
    [
      {
        object: { id: '1', name: 'root', children: [] } as unknown as Object3D<Event>,
        selected: false,
      } as ModelExplorerTreeProps,
      { object: { id: '1', name: 'root', children: [] } as unknown as Object3D<Event>, selected: false },
      {
        object: {
          id: '1',
          name: 'root',
          children: [
            { id: '2', name: 'child', children: [] } as unknown as Mesh,
            { id: '3', name: 'child', children: [] } as unknown as Mesh,
            { id: '4', name: 'child', children: [] } as unknown as Mesh,
          ],
        } as unknown as Object3D<Event>,
        selected: true,
      },
    ].forEach((props) => {
      it(`should render as expected with ${JSON.stringify(props)}`, () => {
        const origObj = new Mesh();
        let transformObj = origObj.clone();

        const restore = jest.fn(() => {
          transformObj = origObj.clone();
        });

        (useMaterialEffect as jest.Mock).mockImplementation((cb) => [jest.fn(() => cb(transformObj)), restore]);

        const { container } = render(<ModelExplorerTree {...props} />);
        expect(container).toMatchSnapshot();
      });
    });
  });
});
