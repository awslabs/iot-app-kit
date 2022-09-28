import { getGlobalSettings } from '../common/GlobalSettings';
import { IMetricRecorder } from '../interfaces';
import useLogger from '../logger/react-logger/hooks/useLogger';

const useMetricRecorder = () => {
  const log = useLogger('MetricRecorder');

  const defaultRecorder = {
    recordClick: (context: string, detail: any) => {
      /* istanbul ignore else */
      if (log) {
        log.verbose(context, detail);
      }
    },
  } as IMetricRecorder;

  const metricRecorder = getGlobalSettings().metricRecorder || defaultRecorder;

  return metricRecorder;
};

export default useMetricRecorder;
