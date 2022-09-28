import { playbackModeToggleBtnStyle } from '../styles';

export const getLiveToggleButton = (toggleButtonId: string) => {
  return `<button id='${toggleButtonId}' name='btn-toggle-pb-mode' style='${playbackModeToggleBtnStyle}'>LIVE</button>`;
};
