import React, { memo } from 'react';
import styled from 'styled-components';
import * as WidgetIcon from './icons';
import { WidgetOption } from './widget-option';

export const WidgetBar = memo(function () {
  return (
    <StyledWidgetBar>
      <WidgetBarHeading>Widgets</WidgetBarHeading>
      <WidgetList>
        <WidgetOption title='Line chart' widgetType='xy-plot' key='xy-plot'>
          <WidgetIcon.XYPlotIcon />
        </WidgetOption>

        <WidgetOption title='Bar chart' widgetType='bar-chart' key='bar-chart'>
          <WidgetIcon.BarChartIcon />
        </WidgetOption>

        <WidgetOption
          title='Status timeline'
          widgetType='status-timeline'
          key='status-timeline'
        >
          <WidgetIcon.StatusTimelineIcon />
        </WidgetOption>

        <WidgetOption title='KPI' widgetType='kpi' key='kpi'>
          <WidgetIcon.KPIIcon />
        </WidgetOption>

        <WidgetOption title='Gauge' widgetType='gauge' key='gauge'>
          <WidgetIcon.GaugeIcon />
        </WidgetOption>

        <WidgetOption title='Table' widgetType='table' key='table'>
          <WidgetIcon.TableIcon />
        </WidgetOption>

        <WidgetOption title='Text' widgetType='text' key='text'>
          <WidgetIcon.TextIcon />
        </WidgetOption>
      </WidgetList>
    </StyledWidgetBar>
  );
});

const StyledWidgetBar = styled.div`
  display: flex;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: 12px;

  border-top: var(--dashboard-border);
`;

const WidgetBarHeading = styled.h4`
  margin: 0;
  padding: 4px;
  border-right: var(--dashboard-border);
  padding-right: 16px;
  margin-right: 16px;
`;

const WidgetList = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  padding: 0;
`;
