import { createNodeErrorStateSlice } from '../../../src/store/slices/NodeErrorStateSlice';

describe('createNodeErrorStateSlice', () => {
  it('should be able to addNodeError', () => {
    // Arrange
    const errorMap = {};
    const draft = { lastOperation: undefined, nodeErrorMap: errorMap };
    const get = jest.fn(() => ({ errorMap })); // fake out get call
    const set = jest.fn(((callback) => callback(draft)) as any);
    const newNodeRef = 'new-error';
    const newErrorMessage = 'fake error';
    const expected = { ...errorMap, [newNodeRef]: newErrorMessage };

    // Act
    const { addNodeError } = createNodeErrorStateSlice(set, get as any, undefined as any); // api is never used in the function, so it's not needed
    addNodeError(newNodeRef, newErrorMessage);

    // Assert
    expect(draft.nodeErrorMap).toEqual(expected);
    expect(get).toBeCalled();
    expect(set).toBeCalled();
  });
  it('should be able to removeNodeError', () => {
    // Arrange
    const errorMap = { 'test-ref': 'this is a fake error' };
    const draft = { lastOperation: undefined, nodeErrorMap: errorMap };
    const get = jest.fn(() => ({ errorMap })); // fake out get call
    const set = jest.fn(((callback) => callback(draft)) as any);
    const expected = {};

    // Act
    const { removeNodeError } = createNodeErrorStateSlice(set, get as any, undefined as any); // api is never used in the function, so it's not needed
    removeNodeError('test-ref');

    // Assert
    expect(draft.nodeErrorMap).toEqual(expected);
    expect(get).toBeCalled();
    expect(set).toBeCalled();
  });
});
