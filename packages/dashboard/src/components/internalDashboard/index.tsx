import React from 'react';
import { useDispatch } from 'react-redux';
import { ResizablePanes } from '../resizablePanes';

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
      <div className="iot-dashboard-panes-area">
        <ResizablePanes
          leftPane={<div className="dummy-content">Resource explorer pane</div>}
          centerPane={<div className="iot-dashboard-grid">grid</div>}
          rightPane={<div className="dummy-content">Component pane</div>}
        />
      </div>
    </div>
  );
};

export default InternalIotDashboard;
