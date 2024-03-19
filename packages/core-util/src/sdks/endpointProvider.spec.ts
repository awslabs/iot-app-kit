import { getEndpointPovider } from './endpointProvider';

it('constructs endpoint correctly', async () => {
  const provider = getEndpointPovider({
    subDomain: 'test',
    awsRegion: 'us-west-2',
    awsPartition: 'aws',
  });
  expect((await provider()).url.toString()).toEqual(
    'https://test.us-west-2.amazonaws.aws/'
  );
});
