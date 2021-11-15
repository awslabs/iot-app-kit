import { SECOND_IN_MS } from '../../common/time';

const DEFAULT_REFRESH_RATE = 5 * SECOND_IN_MS;

type IntervalMap = {
  [id: string]: number;
};

export default class RequestScheduler {
  private intervalMap: IntervalMap = {};

  public create = ({
    id,
    duration,
    refreshRate = DEFAULT_REFRESH_RATE,
    cb,
  }: {
    id: string;
    duration: number;
    refreshRate?: number;
    cb: ({ start, end }: { start: Date; end: Date }) => void;
  }): void => {
    if (id in this.intervalMap) {
      return;
    }

    this.intervalMap[id] = (setInterval(() => {
      cb({ start: new Date(Date.now() - duration), end: new Date() });
    }, refreshRate) as unknown) as number;
  };

  public remove = (id: string): void => {
    if (!(id in this.intervalMap)) {
      return;
    }

    clearInterval(this.intervalMap[id]);
    delete this.intervalMap[id];
  };

  public isScheduled = (id: string): boolean => id in this.intervalMap;
}
