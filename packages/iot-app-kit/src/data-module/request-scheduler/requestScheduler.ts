export default class RequestScheduler {
  private intervalMap: {
    [id: string]: { start: Date; end: Date; intervalId?: number };
  } = {};

  public create = ({
    id,
    duration,
    cb,
  }: {
    id: string;
    duration: number;
    cb: ({ start, end }: { start: Date; end: Date }) => void;
  }): void => {
    if (id in this.intervalMap) {
      return;
    }

    this.intervalMap[id] = { start: new Date(new Date().getTime() - duration), end: new Date() };
    this.intervalMap[id].intervalId = (setInterval(() => {
      const { start, end } = this.intervalMap[id];
      const newStart = new Date(start.getTime() + duration);
      const newEnd = new Date(end.getTime() + duration);

      this.intervalMap[id] = { ...this.intervalMap[id], start: newStart, end: newEnd };
      cb({ start: newStart, end: newEnd });
    }, duration) as unknown) as number;
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
