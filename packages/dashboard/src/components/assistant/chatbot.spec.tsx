import { act, render } from "@testing-library/react";
import { Chatbot } from "./chatbot";

describe('Chatbot', () => {
  test('renders correctly', () => {
    const { getByText, getByAltText } = render(
      <Chatbot height={0} top={0} />
    );

    expect(getByAltText('Assistant Icon')).toBeInTheDocument();
  });

  test('should open chat correctly', () => {
    const { getByText, getByRole } = render(
      <Chatbot height={0} top={0} />
    );

    expect(getByRole('button', { name: 'Assistant Icon' })).toBeInTheDocument();
    const chatbotButton = getByRole('button', { name: 'Assistant Icon' });
    act(() => {
      chatbotButton.click();
    });
    expect(getByText('Sitewise Assistant')).toBeVisible();    
  });

  test('should close chat correctly', () => {
    const { getByText, getByRole, container } = render(
      <Chatbot height={0} top={0} />
    );

    expect(getByRole('button', { name: 'Assistant Icon' })).toBeInTheDocument();
    const chatbotButton = getByRole('button', { name: 'Assistant Icon' });
    act(() => {
      chatbotButton.click();
    });
    expect(getByText('Sitewise Assistant')).toBeVisible();
    
    expect(container.querySelector('[data-testid=assistant-chatbot-close-button]')).not.toBeNull();
    const closeButton = container.querySelector('[data-testid=assistant-chatbot-close-button]') as HTMLButtonElement;
    act(() => {
      closeButton?.click();
    })
  });
  
});