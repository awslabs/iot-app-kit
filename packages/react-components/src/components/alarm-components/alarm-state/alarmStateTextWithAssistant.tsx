import { AlarmPopover } from '../../popover/alarm-popover/alarmPopover';
import { type AssistantProperty } from '../../../common/assistantProps';
import { AlarmStateText, type AlarmStateTextOptions } from './alarmStateText';
import { type AlarmContent } from '../alarm-content/types';

type AlarmStateTextWithAssistantOptions = AlarmStateTextOptions & {
  assistant: AssistantProperty;
  alarmContent?: AlarmContent;
};

export const AlarmStateTextWithAssistant = ({
  alarmContent,
  status,
  isLoading,
  inheritFontColor,
  assistant,
}: AlarmStateTextWithAssistantOptions) => {
  return (
    <AlarmPopover assistant={assistant} alarmContent={alarmContent}>
      <AlarmStateText
        alarmState={alarmContent?.alarmState}
        status={status}
        isLoading={isLoading}
        inheritFontColor={inheritFontColor}
        additionalStyles={{ cursor: 'pointer' }}
      />
    </AlarmPopover>
  );
};
