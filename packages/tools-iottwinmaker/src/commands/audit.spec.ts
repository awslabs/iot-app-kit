import { GetWorkspaceCommand, IoTTwinMakerClient, ResourceNotFoundException } from '@aws-sdk/client-iottwinmaker';
import { handler, Options } from './audit';
import { Arguments } from 'yargs';
import { mockClient } from 'aws-sdk-client-mock';

const twinmakerMock = mockClient(IoTTwinMakerClient);

// TODO add tests after implementation

it('throws error when given workspace that does not exist', async () => {
  twinmakerMock.on(GetWorkspaceCommand).rejects(new ResourceNotFoundException({ $metadata: {}, message: '' }));

  const argv2 = {
    _: ['audit'],
    $0: 'tmdt_local',
    region: 'us-east-1',
    'workspace-id': 'non-existent',
  } as Arguments<Options>;
  await expect(handler(argv2)).rejects.toThrow(ResourceNotFoundException);
});
