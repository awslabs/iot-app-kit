export const leastSevere = 3;
export const mostSevere = 1;

// change when sounds are determined
export const defaultAudioSrc = [
  'https://audio-alert-sounds.s3.amazonaws.com/Cute-Chime-2.mp3',
  'https://audio-alert-sounds.s3.amazonaws.com/new-message-3.ogg',
  'https://audio-alert-sounds.s3.amazonaws.com/new-message-5.ogg',
];

// 1500 ms is approximately the amount of lag time between the end viewport of a live viewport and real time
// This number was accidentally discovered in the IoT App Kit when Synchro Charts had this issue: https://github.com/awslabs/synchro-charts/issues/150
export const liveDataTimeBuffer = 1500;
