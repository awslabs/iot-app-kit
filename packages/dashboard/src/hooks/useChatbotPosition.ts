import { useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

export const CHATBOT_DEFAULT_HEIGHT = 500;
export const CHATBOT_DEFAULT_TOP = 10;

export const getScrollParent = (node: Element | null): Element | null => {
  if (node === null) {
    return null;
  }

  if (node?.scrollHeight > node?.clientHeight) {
    return node;
  } else {
    return getScrollParent(node.parentElement);
  }
};

export const useChatbotPosition = (
  scrollableParent: Element | null,
  dashboardContainerSelector: string
) => {
  const [chatbotHeight, setChatbotHeight] = useState<number>(
    CHATBOT_DEFAULT_HEIGHT
  );
  const [chatbotTop, setChatbotTop] = useState<number>(CHATBOT_DEFAULT_TOP);

  const calculateChatbotDimensions = useDebounceCallback(() => {
    const displayAreaElement = document.querySelector(
      dashboardContainerSelector
    );
    const displayAreaDimensions = displayAreaElement?.getBoundingClientRect();

    // calculate chatbot top position
    const initialTopPosition = CHATBOT_DEFAULT_TOP + (displayAreaDimensions?.top ?? 0);
    const scrollTop = scrollableParent?.scrollTop ?? 0;
    const newTopPos = initialTopPosition - scrollTop;
    setChatbotTop(newTopPos > 0 ? newTopPos : 0);

    // calculate chatbot height
    const displayAreaHeight = window.innerHeight || CHATBOT_DEFAULT_HEIGHT;
    const containerTop = displayAreaDimensions?.top || 0;
    setChatbotHeight(displayAreaHeight - Math.abs(containerTop));
  }, 10);

  return {
    calculateChatbotDimensions,
    chatbotHeight,
    chatbotTop,
  };
};
