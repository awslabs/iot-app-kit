import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

/**
 * For developing purposes only.
 * Will be removed once component palette
 * and asset explorer are implemented.
 */
// import { DEMO_TURBINE_ASSET_1, DEMO_TURBINE_ASSET_1_PROPERTY_4, query } from '../../../testing/siteWiseQueries';

import { onCreateWidgetsAction } from '../../store/actions';
// import { DashboardState } from '../../store/state';

import './index.css';

const InternalIotDashboard = () => {
  const dispatch = useDispatch();

  // const widgets = useSelector((state: DashboardState) => state.dashboardConfiguration.widgets);

  const createWidgets = () =>
    dispatch(
      onCreateWidgetsAction({
        widgets: [],
      })
    );

  return (
    <div className="iot-dashboard">
      <div className="iot-dashboard-toolbar">
        toolbar
        <button onClick={createWidgets}>Add widget</button>
      </div>
      <div className="iot-resizable-panel iot-resizable-panel-left">left panel</div>
      <div className="iot-dashboard-grid">grid</div>
      <div className="iot-resizable-panel iot-resizable-panel-right">right panel</div>
    </div>
  );
};

export default InternalIotDashboard;
