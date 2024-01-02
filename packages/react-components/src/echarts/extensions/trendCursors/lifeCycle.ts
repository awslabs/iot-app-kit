import { EChartsExtensionInstallRegisters } from 'echarts/types/src/extension';
import { SeriesModelRenderInformation, TrendCursorView } from './view';
import { clonePolyLine, createPolyLineFromPoints } from './view/utils/polyline';
import { TrendCursorModel } from './model';

// Echarts core use type does not map correctly to the echarts extension type so exporting as any
// eslint-disable-next-line
export const lifecycleExtension: any = (
  registers: EChartsExtensionInstallRegisters
) => {
  registers.registerUpdateLifecycle(
    'series:afterupdate',
    (ecModel, api, params) => {
      if (!params.updatedSeries) return;
      const renderInformation: SeriesModelRenderInformation[] = [];

      const chartId = ecModel.getOption().appKitChartId as string;

      params.updatedSeries.forEach((series) => {
        const model =
          series as unknown as SeriesModelRenderInformation['model'];
        // Scatter handled specially because we must recreate the polyline from the points
        if (series.type === 'series.scatter') {
          const values: number[] = [];
          series.getData().each((dims) => {
            const dataPoints = series.getData().getItemLayout(dims);
            if (series.coordinateSystem.containPoint(dataPoints)) {
              values.push(...dataPoints);
            }
          });
          const points = new Float32Array(values.flat());
          renderInformation.push({
            model,
            polyline: createPolyLineFromPoints(points),
          });
        } else {
          // LineView type isn't exported by echarts
          // eslint-disable-next-line
          const view = api.getViewOfSeriesModel(series) as any;

          // Note, this is set only by LineView
          // This is why we cannot use it on scatter plots
          // any new series view that does not set this will
          // need to be handled specially.
          // Step charts are implemented as LineView's
          const polyline = view._polyline;

          if (!polyline) return;

          renderInformation.push({
            model,
            polyline: clonePolyLine(polyline),
          });
        }
      });

      ecModel.eachComponent('trendCursors', (model) => {
        const view = api.getViewOfComponentModel(
          model
        ) as unknown as TrendCursorView;
        view.drawCursor(
          chartId,
          model as unknown as TrendCursorModel,
          renderInformation,
          api
        );
      });
    }
  );
};
