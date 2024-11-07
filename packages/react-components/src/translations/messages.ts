import merge from 'lodash.merge';
import { AnomalyChart, type AnomalyChartMessageKeys } from './anomalyWidget';
import { Echarts, type EchartsMessageKeys } from './echarts';
import {
  AssistantActionPanel,
  type AssistantActionPanelMessageKeys,
  AssistantResultPanel,
  type AssistantResultPanelMessageKeys,
} from './assistantActionPanel/messages';
import { type Messages } from './types';
import { Table, type TableMessageKeys } from './table/messages';

/**
 * In order to add messages to the intl instance
 * 1. define a messages object that defines a message
 *    for all of the supported locales. Keys must
 *    be unique across all messages.
 * 2. Add the message keys to the MessageKeys type below
 * 3. Add the messages to the componentMessages list below
 *
 * Note: the getMessageKey function can be used to select
 *    only messges that are added to the MessageKeys
 *    since this is the type that mergedMessages uses
 *    and will have the list of all messages supported
 *    in the intl instance.
 */

// List of all of the keys for all components
export type MessageKeys =
  | AnomalyChartMessageKeys
  | EchartsMessageKeys
  | AssistantActionPanelMessageKeys
  | AssistantResultPanelMessageKeys
  | TableMessageKeys;
export type AllMessages = Messages<MessageKeys>;

// List of all component messages to be merged by locale.
const componentMessages = [
  AnomalyChart,
  Echarts,
  AssistantActionPanel,
  AssistantResultPanel,
  Table,
];

// All merged messages
export const mergedMessages = componentMessages.reduce(
  (messages, componentMessages) => merge({}, messages, componentMessages),
  {} as Messages<MessageKeys>
);

// Helper function to easily select a key that is supported in the message
export const getMessageKey = (key: MessageKeys) => key;
