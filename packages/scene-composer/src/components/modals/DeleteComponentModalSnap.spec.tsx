import { render } from '@/tests/testing-library';

import { KnownComponentType } from '../../interfaces';
import { accessStore } from '../../store';

import DeleteComponentModal from './DeleteComponentModal';

vi.mock('./DeleteConfirmationModal', () => ({ default: (props) => <div>{Object.values(props)}</div> }));

describe('DeleteComponentModal', () => {
  const baseState = {
    setDeleteConfirmationModalVisible: vi.fn(),
    getSceneNodeByRef: vi.fn().mockReturnValue({
      name: 'delete-node-name',
      components: [{ ref: 'delete-comp-1', type: KnownComponentType.Tag }],
    }),
    removeComponent: vi.fn(),
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
