import { render } from '@testing-library/react';

import { accessStore } from '../../store';
import { KnownComponentType } from '../../interfaces';

import DeleteComponentModal from './DeleteComponentModal';

jest.mock('./DeleteConfirmationModal', () => (props) => <div>{Object.values(props)}</div>);

describe('DeleteComponentModal', () => {
  const baseState = {
    setDeleteConfirmationModalVisible: jest.fn(),
    getSceneNodeByRef: jest.fn().mockReturnValue({
      name: 'delete-node-name',
      components: [{ ref: 'delete-comp-1', type: KnownComponentType.Tag }],
    }),
    removeComponent: jest.fn(),
  };

  it('should render correctly', () => {
    accessStore('default').setState({
      ...baseState,
      deleteConfirmationModalParams: {
        type: 'deleteComponent',
        nodeRef: 'delete-node-1',
        componentRef: 'delete-comp-1',
      },
    });

    const { container } = render(<DeleteComponentModal />);
    expect(container).toMatchSnapshot();
  });
});
