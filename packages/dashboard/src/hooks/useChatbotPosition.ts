import { useState } from 'react';
import { useDebounceCallback } from 'usehooks-ts';

export const CHATBOT_DEFAULT_HEIGHT = 500;
export const CHATBOT_DEFAULT_TOP = 20;
export const CHATBOT_DEFAULT_RIGHT = 20;

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
  dashboardHeaderSelector: string,
  dashboardContainerSelector: string
) => {
  const [chatbotHeight, setChatbotHeight] = useState<number>(
    CHATBOT_DEFAULT_HEIGHT
  );
  const [chatbotTop, setChatbotTop] = useState<number>(CHATBOT_DEFAULT_TOP);

  const calculateChatbotDimensions = useDebounceCallback(() => {
    // calculate chatbot top position
    const dashboardHeaderHeight =
      document.querySelector(dashboardHeaderSelector)?.clientHeight || 0;
    const initialTopPosition = CHATBOT_DEFAULT_TOP + dashboardHeaderHeight;
    const scrollTop = scrollableParent?.scrollTop ?? 0;
    const newTopPos = initialTopPosition - scrollTop;
    setChatbotTop(newTopPos > 0 ? newTopPos : 0);

    // calculate chatbot height
    const displayAreaElement = document.querySelector(
      dashboardContainerSelector
    );
    const displayAreaDimensions = displayAreaElement?.getBoundingClientRect();
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
