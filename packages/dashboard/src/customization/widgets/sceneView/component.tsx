import React, {lazy} from 'react';

import type { KPIWidget } from '../types';

//import './scene/global';
import PageLoader from './scene/PageLoader';
const ScenePage = lazy(async() => await import('./scene/ScenePage'));


import './component.css';

import WidgetTile from '~/components/widgets/tile';

const SceneViewWidgetComponent: React.FC<KPIWidget> = (widget) => {

    return (
      <WidgetTile widget={widget}>
        <SceneViewWidgetEmptyStateComponent />
      </WidgetTile>
    );

};

const SceneViewWidgetEmptyStateComponent: React.FC = () => {
  return (
    <div className='kpi-widget-empty-state'>
      <div className='kpi-widget-empty-state-message-container'>

      <PageLoader>
        <ScenePage />
      </PageLoader>

      </div>
    </div>
  );
};

export default SceneViewWidgetComponent;
