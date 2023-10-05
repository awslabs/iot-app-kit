import { rest } from 'msw';
import { type DescribeTimeSeriesRequest, type DescribeTimeSeriesResponse } from '@aws-sdk/client-iotsitewise';
import { SITEWISE_CONTROL_PLANE_API_BASE_URL } from '../../constants';

import { TIME_SERIES_DESCRIPTIONS } from '../../resources/timeSeries';

const DESCRIBE_TIME_SERIES_URL = `${SITEWISE_CONTROL_PLANE_API_BASE_URL}/time-series/describe`;

export function describeTimeSeriesHandler() {
  return rest.get(DESCRIBE_TIME_SERIES_URL, (req, res, ctx) => {
    const alias: DescribeTimeSeriesRequest['alias'] = req.url.searchParams.get('alias') ?? undefined;
    const assetId: DescribeTimeSeriesRequest['assetId'] = req.url.searchParams.get('assetId') ?? undefined;
    const propertyId: DescribeTimeSeriesRequest['propertyId'] = req.url.searchParams.get('propertyId') ?? undefined;

    if (!alias && !assetId && !propertyId) {
      return res(ctx.status(400));
    }

    if (assetId && !propertyId) {
      return res(ctx.status(400));
    }

    if (propertyId && !assetId) {
      return res(ctx.status(400));
    }

    const response: DescribeTimeSeriesResponse | undefined = TIME_SERIES_DESCRIPTIONS.find((timeSeries) => {
      if (alias) {
        return timeSeries.alias === alias;
      }

      if (assetId && propertyId) {
        return timeSeries.assetId === assetId && timeSeries.propertyId === propertyId;
      }
    });

    if (!response) {
      return res(ctx.status(404));
    }

    return res(ctx.status(200), ctx.json(response));
  });
}
