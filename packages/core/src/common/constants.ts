// For audio alert usage
export const leastSevere = 3;
export const mostSevere = 1;

// These sounds are currently stored in qianweiz@ dev account and used for audio alerts
// TODO: Move these sounds to a service account
export const defaultAudioSrc = [
  'https://audio-alert-sounds.s3.amazonaws.com/Cute-Chime-2.mp3',
  'https://audio-alert-sounds.s3.amazonaws.com/new-message-3.ogg',
  'https://audio-alert-sounds.s3.amazonaws.com/new-message-5.ogg',
];

/* This number was accidentally discovered through console logs in the IoT App Kit when Synchro Charts had issue:
 https://github.com/awslabs/synchro-charts/issues/150. Because of the issue, Synchro Charts changes a MinimalLiveViewport
 to a MinimalStaticViewport that is updated on every live tick, and 1500ms is the approximate amount of lag time
 between the resulting viewport.end and real time */
export const liveDataTimeBufferMs = 1500;
