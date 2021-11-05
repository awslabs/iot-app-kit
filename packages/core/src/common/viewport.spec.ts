import { DAY_IN_MS } from './time';
import { viewportEndDate, viewportStartDate } from './viewPort';

const mockCurrentTime = (mockedDate: Date) => {
  // @ts-ignore
  Date.now = jest.spyOn(Date, 'now').mockImplementation(() => mockedDate.getTime());
};

describe('viewportStart', () => {
  it('returns start date if one is present', () => {
    const START = new Date(2000, 0, 0);
    expect(viewportStartDate({ start: START, end: new Date() })).toStrictEqual(START);
  });

  it('returns start date when only the duration is present', () => {
    const TIME = new Date(2000, 0, 1);
    mockCurrentTime(TIME);
    expect(viewportStartDate({ duration: DAY_IN_MS })).toEqual(new Date(Date.now() - DAY_IN_MS));
  });
});

describe('viewportEnd', () => {
  it('returns end date if one is present', () => {
    const END = new Date(2000, 0, 0);
    expect(viewportEndDate({ start: new Date(), end: END })).toStrictEqual(END);
  });

  it('returns end date when only the duration is present', () => {
    const TIME = new Date(2000, 0, 1);
    mockCurrentTime(TIME);
    expect(viewportEndDate({ duration: DAY_IN_MS })).toEqual(TIME);
  });
});
