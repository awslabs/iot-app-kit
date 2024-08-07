import {
  getAssistantStore,
  getAllAssistantContext,
  getContextByComponent,
  setContextByComponent,
  updateContextByComponent,
} from '@iot-app-kit/core-util';

export const useAssistantContext = () => {
  const assistantContext = getAssistantStore();
  return {
    assistantContext,
    getAllAssistantContext,
    getContextByComponent,
    setContextByComponent,
    updateContextByComponent,
  };
};
