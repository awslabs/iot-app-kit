import { type ExecuteQueryRequest, type ExecuteQueryResponse } from '@aws-sdk/client-iottwinmaker';
import { RestContext, ResponseResolver, RestRequest } from 'msw';

// https://docs.aws.amazon.com/iot-twinmaker/latest/apireference/API_ExecuteQuery.html
export const executeQueryRequestStub: ResponseResolver<RestRequest<ExecuteQueryRequest>, RestContext> = (
  _req,
  res,
  ctx
) => {
  return res(
    ctx.status(200),
    ctx.json({
      columnDescriptions: [],
      rows: [],
      nextToken: undefined,
    } satisfies ExecuteQueryResponse)
  );
};
