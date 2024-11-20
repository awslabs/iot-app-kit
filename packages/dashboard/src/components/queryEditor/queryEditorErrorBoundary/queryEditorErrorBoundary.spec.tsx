import { render, screen } from '@testing-library/react';
import ue from '@testing-library/user-event';

import { QueryEditorErrorBoundary } from './queryEditorErrorBoundary';
import { ErrorBoundaryTester } from '../helpers/test/errorBoundaryTester';

describe(QueryEditorErrorBoundary, () => {
  it('should render an error boundary', async () => {
    const user = ue.setup();
    render(
      <QueryEditorErrorBoundary>
        <ErrorBoundaryTester />
      </QueryEditorErrorBoundary>
    );

    expect(
      screen.getByText('error fallback is not being rendered')
    ).toBeVisible();
    expect(screen.queryByText('An error occured.')).not.toBeInTheDocument();

    await user.click(screen.getByText('EXPLODE'));

    expect(screen.getByText('An error occured.')).toBeVisible();
    expect(
      screen.queryByText('error fallback is not being rendered')
    ).not.toBeInTheDocument();
  });
});
