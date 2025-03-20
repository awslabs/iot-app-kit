import { SECOND_IN_MS } from '../../common/time';

const DEFAULT_REFRESH_RATE = 5 * SECOND_IN_MS;

interface IntervalDetail {
  intervalId: NodeJS.Timeout;
  refreshRate: number;
  refreshExpiration?: number;
  cb: VoidFunction;
}

interface IntervalMap {
  [id: string]: IntervalDetail;
}

export default class RequestScheduler {
  private intervalMap: IntervalMap = {};

  constructor() {
    // Ensure intervals are reset when the page is visible again to keep them in sync
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  public create({
    id,
    refreshRate = DEFAULT_REFRESH_RATE,
    refreshExpiration,
    cb,
    synchronize = true,
  }: {
    id: string;
    refreshRate?: number;
    refreshExpiration?: number;
    cb: VoidFunction;
    synchronize?: boolean;
  }) {
    if (this.isScheduled(id)) {
      return;
    }

    const isExpired = () =>
      refreshExpiration && Date.now() >= refreshExpiration;

    if (isExpired()) {
      return;
    }

    const intervalId = setInterval(() => {
      if (isExpired()) {
        this.remove(id);

        return;
      }

      cb();
    }, refreshRate);

    this.intervalMap[id] = { intervalId, refreshRate, refreshExpiration, cb };

    if (synchronize) {
      this.synchronizeIntervals();
    }
  }

  public remove(id: string) {
    if (!this.isScheduled(id)) {
      return;
    }

    clearInterval(this.intervalMap[id].intervalId);
    delete this.intervalMap[id];
  }

  public isScheduled = (id: string): boolean => id in this.intervalMap;

  private handleVisibilityChange = () => {
    if (!document.hidden) {
      this.synchronizeIntervals();
    }
  };

  private synchronizeIntervals() {
    Object.keys(this.intervalMap).forEach((id) => {
      this.resetInterval(id, false);
    });
  }

  private resetInterval = (id: string, synchronize = true) => {
    const existingInterval = this.intervalMap[id];

    if (existingInterval) {
      this.remove(id);
      this.create({ id, ...existingInterval, synchronize });
    }
  };
}
