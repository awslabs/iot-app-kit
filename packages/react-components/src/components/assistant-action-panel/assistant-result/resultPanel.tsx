import React, { useRef, useEffect, CSSProperties, useState } from 'react';
import copy from 'copy-to-clipboard';
import { IMessage } from '../../../hooks/useAssistant/types';
import { AssistantProgressBar } from '../../assistant-common/assistantProgressBar';
import { AssistantMessage } from '../../assistant-common/AssistantMessage';
import { ResultHeader } from './resultHeader';
import { ResultFooter } from './resultFooter';
import { calculatePanelPosition } from './utils';
import {
  colorBackgroundButtonNormalDisabled,
  colorChartsPurple500,
} from '@cloudscape-design/design-tokens';

export interface ResultPanelProps {
  componentId: string;
  actionPosition: string;
  messages: Array<IMessage>;
  onClose: () => void;
  onDivedeep: () => void;
}

export const ResultPanel = ({
  componentId,
  actionPosition,
  messages,
  onClose,
  onDivedeep,
}: ResultPanelProps) => {
  const panel = useRef<HTMLDivElement>(null);
  const [panelPositon, setPanelPositon] = useState<CSSProperties>({});
  const filteredMessages = messages.filter(
    (message) => message.originComponentId === componentId
  );
  const lastMessage = filteredMessages.at(-1);
  const isLoading = lastMessage?.loading;

  useEffect(() => {
    const actionPanel = document.querySelector(
      `#assistant-action-panel-${componentId}`
    );
    if (panel.current && actionPanel) {
      setPanelPositon(calculatePanelPosition(actionPanel, actionPosition));
    }
  }, [panel]);

  const handleCopy = () => {
    const results = filteredMessages
      .filter((message) => message.sender === 'assistant')
      .map((message) => message.content)
      .join(' ');

    copy(results, {
      format: 'text/plain',
    });
  };

  return (
    <div
      ref={panel}
      data-testid='action-panel-result'
      className='action-panel-result'
      style={{
        backgroundColor: colorBackgroundButtonNormalDisabled,
        borderColor: colorChartsPurple500,
        ...panelPositon,
      }}
    >
      <ResultHeader onClose={onClose} />
      <div
        className='action-panel-result-content'
        style={{ height: panelPositon.height }}
      >
        {filteredMessages
          .filter((message) => message.sender === 'assistant')
          .map((message) => {
            if (message?.loading) {
              return (
                <AssistantProgressBar
                  key={message.id}
                  content={message.content}
                />
              );
            }
            return (
              <AssistantMessage
                key={message.id}
                text={message.content}
                payload={message.payload}
              />
            );
          })}
      </div>
      {!isLoading ? (
        <ResultFooter onCopy={handleCopy} onDivedeep={onDivedeep} />
      ) : null}
    </div>
  );
};
