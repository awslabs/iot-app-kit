import { toDataStreamId, fromDataStreamId } from './dataStreamId';

const mockIdOutput = '{"componentName":"comp-1","entityId":"entity-1","propertyName":"prop-1","workspaceId":"ws-1"}';
const mockIdInput = { workspaceId: 'ws-1', entityId: 'entity-1', componentName: 'comp-1', propertyName: 'prop-1' };

describe('toDataStreamId', () => {
  it('should converts the same id values to the same data stream id', () => {
    const id1 = toDataStreamId(mockIdInput);
    const id2 = toDataStreamId({
      entityId: 'entity-1',
      propertyName: 'prop-1',
      componentName: 'comp-1',
      workspaceId: 'ws-1',
    });

    expect(id1).toEqual(id2);
    expect(id1).toBe(mockIdOutput);
  });
});

describe('fromDataStreamId', () => {
  it('should converts a data stream id to separate ids', () => {
    expect(fromDataStreamId(mockIdOutput)).toEqual(mockIdInput);
  });

  it('return with empty values when given an invalid id', () => {
    const expected = {
      entityId: '',
      propertyName: '',
      componentName: '',
      workspaceId: '',
    };

    expect(fromDataStreamId('some-bad-id!')).toEqual(expected);
  });
});
