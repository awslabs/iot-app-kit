import * as React from "react";
import Container from "@cloudscape-design/components/container";
import { ChatbotHeader } from "./ChatbotHeader";
import { ChatbotInputBox } from "./ChatbotInputBox";
import { ChatbotConversationContainer } from "./conversation/ChatbotConversationContainer";
import "./chatbot.css";

export interface ChatbotProps {

}

export const Chatbot = (_props: ChatbotProps) => {
  return (
      <div className="iot-app-kit assistant-chatbot">
        <Container
          footer={<ChatbotInputBox/> }
          header={<ChatbotHeader headerText="Sitewise Assistant"/>}
          disableHeaderPaddings
        >
          <ChatbotConversationContainer height={400} />
        </Container>
      </div>
  );
} 