import { rest } from 'msw';
import { type ListTimeSeriesRequest, type ListTimeSeriesResponse } from '@aws-sdk/client-iotsitewise';
import { SITEWISE_CONTROL_PLANE_API_BASE_URL } from '../../constants';

import { TIME_SERIES_SUMMARIES } from '../../resources/timeSeries';

const LIST_TIME_SERIES_URL = `${SITEWISE_CONTROL_PLANE_API_BASE_URL}/time-series`;

export function listTimeSeriesHandler() {
  return rest.get(LIST_TIME_SERIES_URL, (req, res, ctx) => {
    const aliasPrefix: ListTimeSeriesRequest['aliasPrefix'] = req.url.searchParams.get('aliasPrefix') ?? undefined;
    const assetId: ListTimeSeriesRequest['assetId'] = req.url.searchParams.get('assetId') ?? undefined;
    const timeSeriesType: ListTimeSeriesRequest['timeSeriesType'] =
      req.url.searchParams.get('timeSeriesType') ?? undefined;

    if (timeSeriesType === 'ASSOCIATED' && !assetId) {
      return res(ctx.status(400));
    }

    if (timeSeriesType === 'DISASSOCIATED' && !aliasPrefix) {
      return res(ctx.status(400));
    }

    const response: ListTimeSeriesResponse = {
      TimeSeriesSummaries: TIME_SERIES_SUMMARIES,
    };

    return res(ctx.status(200), ctx.json(response));
  });
}
