import { useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

export const CHATBOT_DEFAULT_HEIGHT = 500;

export const useChatbotPosition = (
  dashboardContainerSelector: string,
) => {
  const [chatbotHeight, setChatbotHeight] = useState<number>(
    CHATBOT_DEFAULT_HEIGHT
  );

  const calculateChatbotDimensions = useDebounceCallback(() => {
    const displayAreaElement = document.querySelector(
      dashboardContainerSelector
    );
    
    const displayAreaDimensions = displayAreaElement?.getBoundingClientRect();

    // calculate chatbot height
    const displayAreaHeight = window.innerHeight || CHATBOT_DEFAULT_HEIGHT;
    const containerTop = displayAreaDimensions?.top || 0;
    setChatbotHeight(displayAreaHeight - Math.abs(containerTop));
  }, 10);

  return {
    calculateChatbotDimensions,
    chatbotHeight,
  };
};
