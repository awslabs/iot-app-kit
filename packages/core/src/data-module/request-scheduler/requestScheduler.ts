import { SECOND_IN_MS } from '../../common/time';

const DEFAULT_REFRESH_RATE = 5 * SECOND_IN_MS;

export default class RequestScheduler {
  private intervalMap: {
    [id: string]: { start: Date; end: Date; intervalId?: number };
  } = {};

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

    this.intervalMap[id] = { start: new Date(new Date().getTime() - duration), end: new Date() };
    this.intervalMap[id].intervalId = (setInterval(() => {
      const newStart = new Date(Date.now() - duration);
      const newEnd = new Date();

      this.intervalMap[id] = { ...this.intervalMap[id], start: newStart, end: newEnd };
      cb({ start: newStart, end: newEnd });
    }, refreshRate) as unknown) as number;
  };

  public remove = (id: string): void => {
    if (!(id in this.intervalMap)) {
      return;
    }

    clearInterval(this.intervalMap[id].intervalId);
    delete this.intervalMap[id];
  };

  public hasScheduler = (id: string): boolean => id in this.intervalMap;
}
