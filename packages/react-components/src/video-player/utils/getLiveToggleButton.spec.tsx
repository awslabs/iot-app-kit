import { playbackModeToggleBtnStyle } from '../styles';
import { getLiveToggleButton } from './getLiveToggleButton';

it('should return live toggle button html', () => {
  const toggleButtonId = 'live-btn';
  const expectedResult = `<button id='${toggleButtonId}' name='btn-toggle-pb-mode' style='${playbackModeToggleBtnStyle}'>LIVE</button>`;
  expect(getLiveToggleButton(toggleButtonId)).toEqual(expectedResult);
});
