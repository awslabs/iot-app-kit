import { SECOND_IN_MS } from '../../common/time';

const DEFAULT_REFRESH_RATE = 5 * SECOND_IN_MS;

type IntervalMap = {
  [id: string]: NodeJS.Timeout;
};

export default class RequestScheduler {
  private intervalMap: IntervalMap = {};

  public create = ({
    id,
    refreshRate = DEFAULT_REFRESH_RATE,
    refreshExpiration,
    cb,
  }: {
    id: string;
    refreshRate?: number;
    refreshExpiration?: number;
    cb: () => void;
  }): void => {
    if (id in this.intervalMap) {
      return;
    }

    const isExpired = () => refreshExpiration && Date.now() >= refreshExpiration;

    if (isExpired()) {
      return;
    }

    this.intervalMap[id] = setInterval(() => {
      if (isExpired()) {
        this.remove(id);
        return;
      }

      cb();
    }, refreshRate);
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
