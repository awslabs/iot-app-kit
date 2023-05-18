import { renderHook } from '@testing-library/react-hooks';

import { useStore } from '../store';

import useMatterportViewer from './useMatterportViewer';

describe('useMatterportViewer', () => {
  const baseState = {
    getSceneProperty: jest.fn(),
  };
  const createState = (connectionName?: string) => ({
    ...baseState,
    noHistoryStates: {
      ...useStore('default').getState().noHistoryStates,
      connectionNameForMatterportViewer: connectionName,
      setConnectionNameForMatterportViewer: jest.fn(),
    },
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should get enableMatterportViewer as true when connectionName and model id are configured', () => {
    useStore('default').setState(createState('mockConnectionName'));
    baseState.getSceneProperty.mockReturnValue('mockMatterportModelId');

    const enableMatterportViewer = renderHook(() => useMatterportViewer()).result.current.enableMatterportViewer;
    expect(enableMatterportViewer).toEqual(true);
  });

  it('should get enableMatterportViewer as false when connectionName is not configured', () => {
    useStore('default').setState(createState());
    baseState.getSceneProperty.mockReturnValue('mockMatterportModelId');

    const enableMatterportViewer = renderHook(() => useMatterportViewer()).result.current.enableMatterportViewer;
    expect(enableMatterportViewer).toEqual(false);
  });

  it('should get enableMatterportViewer as false when model id is not configured', () => {
    useStore('default').setState(createState('mockConnectionName'));
    baseState.getSceneProperty.mockReturnValue(undefined);

    const enableMatterportViewer = renderHook(() => useMatterportViewer()).result.current.enableMatterportViewer;
    expect(enableMatterportViewer).toEqual(false);
  });

  it('should get enableMatterportViewer as false when connectionName and model id are not configured', () => {
    useStore('default').setState(createState());
    baseState.getSceneProperty.mockReturnValue(undefined);

    const enableMatterportViewer = renderHook(() => useMatterportViewer()).result.current.enableMatterportViewer;
    expect(enableMatterportViewer).toEqual(false);
  });
});
