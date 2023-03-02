import { KnownComponentType } from './components';

export interface ITagSettings {
  scale: number;
  autoRescale: boolean;
}

export type IComponentSettings = ITagSettings | any;
export type IComponentSettingsMap = Record<KnownComponentType | string, IComponentSettings>;
