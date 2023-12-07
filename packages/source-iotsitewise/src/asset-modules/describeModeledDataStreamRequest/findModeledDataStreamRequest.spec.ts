import { type IoTSiteWiseClient } from '@aws-sdk/client-iotsitewise';

import { FindModeledDataStreamRequest } from './findModeledDataStreamRequest';

describe(FindModeledDataStreamRequest, () => {
  it('builds', () => {
    const client = { send: jest.fn() } as unknown as IoTSiteWiseClient;
    const request = new FindModeledDataStreamRequest(client);

    expect(request).not.toBeNull();
  });
});
