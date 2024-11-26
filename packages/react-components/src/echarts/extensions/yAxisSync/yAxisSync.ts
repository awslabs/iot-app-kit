import type LineSeriesModel from 'echarts/types/src/chart/line/LineSeries.js';
import { type EChartsExtensionInstallRegisters } from 'echarts/types/src/extension.js';
import { handleSetYAxis } from './updateYAxis';
import { handlesYAxis } from './yAxisPredicates';

// Echarts core use type does not map correctly to the echarts extension type so exporting as any
// eslint-disable-next-line
export const yAxisSyncExtension: any = (
  registers: EChartsExtensionInstallRegisters
) => {
  registers.registerUpdateLifecycle(
    'series:afterupdate',
    (_ecModel, _api, params) => {
      (params.updatedSeries ?? [])
        .filter((series) => handlesYAxis(series.type))
        /**
         * Issue with the exposed types in echarts.
         * SeriesModel<SeriesOption<unknown, DefaultStatesMixin>> which is used in EChartsExtensionInstaller
         * is incompatible with LineSeriesModel | ScatterSeriesModel which is exported by echarts
         * The type used by the extension is not accessible, so casting to LineSeriesModel
         * as it uses the correct type for the coordinateSystem.
         */
        .forEach((series) =>
          handleSetYAxis(series as unknown as LineSeriesModel)
        );
    }
  );
};
