import { mergeHistoricalRequests } from './mergeHistoricalRequests';

it('with no prior history, returns newly added historical request', () => {
  const request = {
    start: new Date(2000, 0, 0),
    end: new Date(2000, 1, 0),
    requestedAt: new Date(2000, 1, 0),
  };
  expect(mergeHistoricalRequests([], request)).toEqual([request]);
});

it('with a single existing non-overlapping historical request, simply append the new request to the front', () => {
  const existingRequest = {
    start: new Date(1999, 0, 0),
    end: new Date(1999, 1, 0),
    requestedAt: new Date(1999, 1, 0),
  };
  const request = {
    start: new Date(2000, 0, 0),
    end: new Date(2000, 1, 0),
    requestedAt: new Date(2000, 1, 0),
  };
  expect(mergeHistoricalRequests([existingRequest], request)).toEqual([
    request,
    existingRequest,
  ]);
});

it('with multiple existing non-overlapping historical request, simply append the new request to the front and maintain prior order', () => {
  const existingRequest1 = {
    start: new Date(1999, 0, 0),
    end: new Date(1999, 1, 0),
    requestedAt: new Date(1999, 1, 0),
  };
  const existingRequest2 = {
    start: new Date(1999, 2, 0),
    end: new Date(1999, 3, 0),
    requestedAt: new Date(1999, 3, 0),
  };
  const request = {
    start: new Date(2000, 0, 0),
    end: new Date(2000, 1, 0),
    requestedAt: new Date(2000, 1, 0),
  };
  const existingHistory = [existingRequest2, existingRequest1];
  expect(mergeHistoricalRequests(existingHistory, request)).toEqual([
    request,
    ...existingHistory,
  ]);
});

it('when a new historical request is append and partially overlaps an existing request, truncate the existing historical request', () => {
  const existingRequest = {
    start: new Date(1999, 0, 0),
    end: new Date(2000, 1, 0),
    requestedAt: new Date(2, 1, 0),
  };
  const request = {
    start: new Date(2000, 0, 0),
    end: new Date(2000, 5, 0),
    requestedAt: new Date(2000, 1, 0),
  };

  expect(mergeHistoricalRequests([existingRequest], request)).toEqual([
    request,
    {
      start: existingRequest.start,
      end: request.start,
      requestedAt: existingRequest.requestedAt,
    },
  ]);
});

it('when a new historical request is append and fully overlaps an existing request, fully remove previous historical request', () => {
  const existingRequest = {
    start: new Date(1999, 0, 0),
    end: new Date(2000, 1, 0),
    requestedAt: new Date(2, 1, 0),
  };
  const request = {
    start: new Date(1999, 0, 0),
    end: new Date(2000, 5, 0),
    requestedAt: new Date(2000, 1, 0),
  };

  expect(mergeHistoricalRequests([existingRequest], request)).toEqual([
    request,
  ]);
});

it('when a new historical request is appended and fully overlaps an multiple existing requests, fully remove previous historical requests', () => {
  const existingRequest1 = {
    start: new Date(1999, 0, 0),
    end: new Date(2000, 0, 0),
    requestedAt: new Date(2000, 0, 0),
  };
  const existingRequest2 = {
    start: new Date(2001, 0, 0),
    end: new Date(2002, 0, 0),
    requestedAt: new Date(2002, 0, 0),
  };
  const request = {
    start: new Date(1995, 0, 0),
    end: new Date(2005, 0, 0),
    requestedAt: new Date(2005, 0, 0),
  };

  expect(
    mergeHistoricalRequests([existingRequest2, existingRequest1], request)
  ).toEqual([request]);
});

it('when a new request partially overlaps one existing request, and fully overlaps another, it will return only two requests, one of which is truncated', () => {
  const existingRequest1 = {
    start: new Date(1999, 0, 0),
    end: new Date(2000, 0, 0),
    requestedAt: new Date(2000, 0, 0),
  };
  const existingRequest2 = {
    start: new Date(2001, 0, 0),
    end: new Date(2002, 0, 0),
    requestedAt: new Date(2002, 0, 0),
  };
  const request = {
    start: new Date(1999, 5, 0),
    end: new Date(2005, 0, 0),
    requestedAt: new Date(2005, 0, 0),
  };

  expect(
    mergeHistoricalRequests([existingRequest2, existingRequest1], request)
  ).toEqual([
    request,
    {
      start: existingRequest1.start,
      end: request.start,
      requestedAt: existingRequest1.requestedAt,
    },
  ]);
});

it('when the new request is after the existing request but partially overlaps', () => {
  const existingRequest = {
    start: new Date(1999, 0, 0),
    end: new Date(2000, 0, 0),
    requestedAt: new Date(2000, 0, 0),
  };
  const request = {
    start: new Date(1999, 5, 0),
    end: new Date(2005, 0, 0),
    requestedAt: new Date(2005, 0, 0),
  };

  expect(mergeHistoricalRequests([existingRequest], request)).toEqual([
    request,
    {
      start: existingRequest.start,
      end: request.start,
      requestedAt: existingRequest.requestedAt,
    },
  ]);
});

it('when the new request is before the existing request but partially overlaps', () => {
  const existingRequest = {
    start: new Date(1999, 0, 0),
    end: new Date(2010, 0, 0),
    requestedAt: new Date(2010, 0, 0),
  };
  const request = {
    start: new Date(1997, 5, 0),
    end: new Date(2005, 0, 0),
    requestedAt: new Date(2005, 0, 0),
  };

  expect(mergeHistoricalRequests([existingRequest], request)).toEqual([
    {
      start: request.end,
      end: existingRequest.end,
      requestedAt: existingRequest.requestedAt,
    },
    request,
  ]);
});
