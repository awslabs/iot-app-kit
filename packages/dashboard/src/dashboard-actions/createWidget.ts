import { concat } from 'lodash';
import { CreateAction, DashboardConfiguration, Widget } from '../types';
import { concatWidgets } from '../util/dashboardConfiguration';
import { dashboardConfig, MockWidgetFactory } from '../testing/mocks';

export const createWidget = ({
  dashboardConfiguration,
  widgets,
}: {
  dashboardConfiguration: DashboardConfiguration;
  widgets: Widget[];
}): DashboardConfiguration => {
  dashboardConfiguration = concatWidgets(dashboardConfiguration, widgets);
  return dashboardConfiguration;
};

const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomWidget = () => {
  const n = getRandomInt(1, 3);
  switch (n) {
    case 1:
      return MockWidgetFactory.getKpiWidget();
    case 2:
      return MockWidgetFactory.getScatterChartWidget();
    case 3:
      return MockWidgetFactory.getLineChartWidget();
  }
  return MockWidgetFactory.getScatterChartWidget();
};
