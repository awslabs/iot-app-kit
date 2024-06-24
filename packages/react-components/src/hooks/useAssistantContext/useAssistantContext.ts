
import { getAssistantContext, setAssistantContext, appendAssistantContext } from '@iot-app-kit/core-util';


export const useAssistantContext = () => {
  const assistantContext = getAssistantContext();
  return {
    assistantContext,
    setContext: setAssistantContext,
    appendContext: appendAssistantContext,
  }
}