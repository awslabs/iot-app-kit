import { type EChartsExtensionInstallRegisters } from 'echarts/types/src/extension.js';
import { actionExtension } from './echartsActions';
import { lifecycleExtension } from './lifeCycle';
import { TrendCursorModel } from './model';
import { TrendCursorView } from './view';

export * from './hooks';

// Echarts core use type does not map correctly to the echarts extension type so exporting as any
// eslint-disable-next-line
export const trendCursorsExtension: any = (
  registers: EChartsExtensionInstallRegisters
) => {
  registers.registerComponentModel(TrendCursorModel);

  // some issue with inheritance of types here
  // eslint-disable-next-line
  registers.registerComponentView(TrendCursorView as any);

  lifecycleExtension(registers);
  actionExtension(registers);
};
