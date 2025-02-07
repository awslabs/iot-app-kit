import { type PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { DashboardHeader } from './dashboardHeader';
import { configureDashboardStore } from '~/store';
import { Provider } from 'react-redux';

describe('DashboardHeader', () => {
  const ProviderWrapper = ({ children }: PropsWithChildren) => (
    <Provider store={configureDashboardStore()}>{children}</Provider>
  );
  it('should render the dashboard title', async () => {
    const props = {
      name: 'My Dashboard',
      editable: false,
      readOnly: true,
      onSave: vi.fn(),
      dashboardConfiguration: {
        widgets: [],
      },
      grid: {
        enabled: true,
        width: 1,
        height: 1,
        cellSize: 1,
      },
      significantDigits: 2,
    };
    const { findByText } = render(<DashboardHeader {...props} />, {
      wrapper: ProviderWrapper,
    });
    const titleElement = await findByText('My Dashboard');
    expect(titleElement).toBeInTheDocument();
  });

  it('should render the TimeSelection component when editable is false', async () => {
    const props = {
      name: 'My Dashboard',
      editable: false,
      readOnly: true,
      onSave: vi.fn(),
      dashboardConfiguration: {
        widgets: [],
      },
      grid: {
        enabled: true,
        width: 1,
        height: 1,
        cellSize: 1,
      },
      significantDigits: 2,
    };
    const { findByTestId } = render(<DashboardHeader {...props} />, {
      wrapper: ProviderWrapper,
    });
    const timeSelectionElement = await findByTestId('time-selection');
    expect(timeSelectionElement).toBeInTheDocument();
  });
});
