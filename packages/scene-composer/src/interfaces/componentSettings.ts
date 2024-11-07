import { type KnownComponentType } from './components';

export interface ITagSettings {
  scale: number;
  autoRescale: boolean;
  enableOcclusion: boolean;
}

export interface IOverlaySettings {
  overlayPanelVisible?: boolean;
}

export type IComponentSettings = ITagSettings | IOverlaySettings;
export type IComponentSettingsMap = Record<KnownComponentType | string, IComponentSettings>;
