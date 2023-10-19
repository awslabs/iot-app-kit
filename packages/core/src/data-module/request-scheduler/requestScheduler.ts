import { SECOND_IN_MS } from '../../common/time';

const DEFAULT_REFRESH_RATE = 5 * SECOND_IN_MS;

type IntervalDetail = {
  intervalId: NodeJS.Timeout;
  refreshRate: number;
  refreshExpiration?: number;
  cb: () => void;
};

type IntervalMap = {
  [id: string]: IntervalDetail;
};

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
  }: {
    id: string;
    refreshRate?: number;
    refreshExpiration?: number;
    cb: () => void;
  }) {
    if (this.isScheduled(id)) {
      return;
    }

    const isExpired = () => refreshExpiration && Date.now() >= refreshExpiration;

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
      Object.keys(this.intervalMap).forEach((id) => {
        this.resetInterval(id);
      });
    }
  };

  private resetInterval(id: string) {
    const existingInterval = this.intervalMap[id];

    if (existingInterval) {
      this.remove(id);
      this.create({ id, ...existingInterval });
    }
  }
}
