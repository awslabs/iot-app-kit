import { DashboardAction, onUpdateWidgetsAction } from './actions';
import { WidgetPropertiesGeneratorMap } from '../customization/widgetPropertiesGeneratorMap';
import { MOCK_KPI_WIDGET } from '../../testing/mocks';
import { updateWidgetMiddleware } from './updateWidgetMiddleware';
import { MiddlewareAPI } from 'redux';

describe('updateWidgetMiddleware', () => {
  beforeEach(() => jest.clearAllMocks());

  const dispatch = jest.fn();
  const store = {
    dispatch,
  };

  const mockOnUpdateWidget = jest.fn((widget) => ({ ...widget, id: 'Widget got touched' }));
  WidgetPropertiesGeneratorMap[MOCK_KPI_WIDGET.type] = {
    onUpdateWidget: mockOnUpdateWidget,
  };
  const callMiddleware = (action: DashboardAction) => {
    return updateWidgetMiddleware(store as unknown as MiddlewareAPI)(dispatch)(action);
  };

  it('does not call onUpdateWidget function if applyUpdateWidget flag is set to false', () => {
    const action = onUpdateWidgetsAction({ widgets: [MOCK_KPI_WIDGET] }, false);
    callMiddleware(action);
    expect(mockOnUpdateWidget).not.toHaveBeenCalled();
  });

  it('does not change action if applyUpdateWidget flag is set to false', () => {
    const updateWidgetsAction = onUpdateWidgetsAction({ widgets: [MOCK_KPI_WIDGET] }, false);
    callMiddleware(updateWidgetsAction);
    expect(dispatch).toHaveBeenCalledWith(updateWidgetsAction);
  });

  it('only calls onUpdateWidget function if applyUpdateWidget flag is set to true', () => {
    const action = onUpdateWidgetsAction({ widgets: [MOCK_KPI_WIDGET] }, true);
    callMiddleware(action);
    expect(mockOnUpdateWidget).toHaveBeenCalled();
  });

  it('does change action result if applyUpdateWidget flag is set to true', () => {
    const action = onUpdateWidgetsAction({ widgets: [MOCK_KPI_WIDGET] }, true);
    callMiddleware(action);
    expect(dispatch).toHaveBeenCalledWith({
      ...action,
      payload: {
        ...action.payload,
        widgets: [{ ...MOCK_KPI_WIDGET, id: 'Widget got touched' }],
      },
    });
  });
});
