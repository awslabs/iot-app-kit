import { colorChartsPurple1200 } from '@cloudscape-design/design-tokens';
import { PrimaryButton } from '@iot-app-kit/atoms/button/primary';
import { memo } from 'react';
import styled from 'styled-components';
import { useAssistantStore } from '../../features/assistant/useAssistantStore';

export const AssistantButton = memo(() => {
  const toggleAssistantMode = useAssistantStore((store) => store.toggleAssistantMode)

  return (
    <AssistantButtonWrapper>
      <PrimaryButton iconName='gen-ai' onClick={toggleAssistantMode}>AI Assistant</PrimaryButton>
    </AssistantButtonWrapper>
  );
});

const AssistantButtonWrapper = styled.span`
  button {
    background: ${colorChartsPurple1200} !important;
    border-color: ${colorChartsPurple1200} !important;
  }
`