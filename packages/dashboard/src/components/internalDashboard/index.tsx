import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MockWidgetFactory } from '../../../testing/mocks';

/**
 * For developing purposes only.
 * Will be removed once component palette
 * and asset explorer are implemented.
 */
// import { DEMO_TURBINE_ASSET_1, DEMO_TURBINE_ASSET_1_PROPERTY_4, query } from '../../../testing/siteWiseQueries';

import { onChangeDashboardWidthAction, onCreateWidgetsAction } from '../../store/actions';
import { DashboardState } from '../../store/state';
import IotGrid, { IotGridProps } from '../grid';
import IotWidgets, { IotWidgetsProps } from '../widgets/list';
// import { DashboardState } from '../../store/state';

import './index.css';

const InternalIotDashboard = () => {
  const dispatch = useDispatch();

  const dashboardConfiguration = useSelector((state: DashboardState) => state.dashboardConfiguration);
  const cellSize = useSelector((state: DashboardState) => state.cellSize);
  const width = useSelector((state: DashboardState) => state.width);

  const createWidgets = () =>
    dispatch(
      onCreateWidgetsAction({
        widgets: [
          MockWidgetFactory.getKpiWidget()
        ],
      })
    );

  const changeWidth = (e: React.ChangeEvent<HTMLInputElement>) =>
      dispatch(onChangeDashboardWidthAction({
        width: parseInt(e.target.value)
      }));

  const gridProps: IotGridProps = {
    width,
    cellSize,
    stretchToFit: false,
  };

  const widgetsProps: IotWidgetsProps = {
    dashboardConfiguration,
    selectedWidgets: [],
    cellSize,
  };

  console.log(dashboardConfiguration);

  return (
    <div className="iot-dashboard">
      <div className="iot-dashboard-toolbar">
        toolbar
        <button onClick={createWidgets}>Add widget</button>
        <input onChange={changeWidth} />
      </div>
      <div className="iot-resizable-panel iot-resizable-panel-left">left panel</div>
      <div className="iot-dashboard-grid">
        <IotGrid { ...gridProps } />
        <IotWidgets { ...widgetsProps } />
      </div>
      <div className="iot-resizable-panel iot-resizable-panel-right">right panel</div>
    </div>
  );
};

export default InternalIotDashboard;
