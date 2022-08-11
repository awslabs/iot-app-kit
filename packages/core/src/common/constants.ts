// For audio alert usage
export const leastSevere = 3;
export const mostSevere = 1;

/* Audio sources can be modified by adding/deleting audio files in iot-app-kit/packages/components and changing the
   corresponding file names here. Supported file types can be found here: https://howlerjs.com */
export const defaultAudioSrc = ['./assets/cuteChime2.mp3', './assets/newMessage3.ogg', './assets/newMessage5.ogg'];

/* This number was accidentally discovered through console logs in the IoT App Kit when Synchro Charts had issue:
 https://github.com/awslabs/synchro-charts/issues/150. Because of the issue, Synchro Charts changes a MinimalLiveViewport
 to a MinimalStaticViewport that is updated on every live tick, and 1500ms is the approximate amount of lag time
 between the resulting viewport.end and real time */
export const liveDataTimeBufferMs = 1500;
