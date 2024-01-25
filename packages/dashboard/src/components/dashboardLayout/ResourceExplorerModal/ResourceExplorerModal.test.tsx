import { render, screen } from '@testing-library/react';
import React from 'react';
import { ResourceExplorerModal } from '~/components/dashboardLayout/ResourceExplorerModal/ResourceExplorerModal';

const reElement = <div>This is resource explorer</div>;
describe('testing resource explorer modal', () => {
  it('should render', () => {
    const { container } = render(
      <ResourceExplorerModal
        resourceExplorer={reElement}
        visible={true}
        onDismiss={() => {}}
      />
    );
    expect(container).not.toBeNull();
  });

  it('should render the given react node', () => {
    render(
      <ResourceExplorerModal
        resourceExplorer={reElement}
        visible={true}
        onDismiss={() => {}}
      />
    );
    const element = screen.getByText('This is resource explorer');
    expect(element).toBeVisible();
  });
});
