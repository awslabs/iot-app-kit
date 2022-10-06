import DOMPurify from 'dompurify';
import React from 'react';
import { v4 as uuid } from 'uuid';
import videojs, { VideoJsPlayer } from 'video.js';
import 'video.js/dist/video-js.css';
import {
  html5NotSupportedMessage,
  noVideoAvailableMessage,
  PLAYBACKMODE_LIVE,
  PLAYBACKMODE_ON_DEMAND,
  videoJsOptions,
  videoOnEdgeMessage,
} from './constants';
import { liveButtonBackground, noVideoAvailableStyle, ondemandButtonBackground } from './styles';
import { IVideoPlayerProps, IVideoPlayerState, VideoTimeRanges, VideoTimeRangesWithSource } from './types';
import { getFormattedDateTime, getNewSeekTime, getStartAndEndTimeForVideo } from './utils/dateTimeUtils';
import { filterTimerangesForVideoOnEdge } from './utils/filterTimeRanges';
import { customVideoProgressBar } from './customVideoProgressBar';
import { getLiveToggleButton } from './utils/getLiveToggleButton';
import {
  getVideoProgressPercentage,
  getVideoProgressSeekTime,
  getVideoProgressTooltip,
} from './utils/videoProgressUtils';
import { Viewport, viewportEndDate, viewportStartDate } from '@iot-app-kit/core';

export class VideoPlayer extends React.Component<IVideoPlayerProps, IVideoPlayerState> {
  private domRef: React.RefObject<HTMLVideoElement>;
  private videoPlayerId: string = uuid();
  private videoPlayer?: VideoJsPlayer;
  private seekbar?: HTMLElement;
  private progressBar?: HTMLElement;
  private currentTimeIndicator?: HTMLElement;
  private liveToggleButton?: HTMLButtonElement;
  private currentOnDemandSource?: { start: number; end: number; src: string };
  private liveToggleButtonId = '';
  private progressControlId = '';
  private timerangesWithSource: VideoTimeRangesWithSource = [];
  private timerangesForVideoOnEdge: VideoTimeRanges = [];
  private timerangesForVideoOnEdgeRaw: VideoTimeRanges = [];
  private readonly uploadLiveVideoTimer: number = 120000; // 2 minutes timer in milli seconds to trigger live video upload every 2 minutes
  private triggerLiveVideoRequesttimeout: ReturnType<typeof setTimeout>;
  private waitForLiveTimeout: ReturnType<typeof setTimeout>;
  private videoErrorDialog?: videojs.ModalDialog;
  // Boolean flag to keep track if video is seeked by the user explicitly
  private isVideoSeeking = false;
  // Skip playback mode updates if it is manually toggled by user
  private togglingPlaybackMode = false;
  private startTime: Date;
  private endTime: Date;

  constructor(props: IVideoPlayerProps) {
    super(props);
    // If viewport contains duration, then it is LIVE mode.
    // If viewport contains start and end, then it is ON_DEMAND mode.
    const initialPlaybackMode =
      'start' in props.viewport && 'end' in props.viewport ? PLAYBACKMODE_ON_DEMAND : PLAYBACKMODE_LIVE;
    this.state = {
      playbackMode: initialPlaybackMode,
    };
    this.setVideoPlayerStartAndEndTime(props.viewport, initialPlaybackMode);
    this.domRef = React.createRef();
  }

  componentDidUpdate = async (prevProps: IVideoPlayerProps, prevStates: IVideoPlayerState) => {
    if (!this.togglingPlaybackMode) {
      const updatedPlaybackMode =
        'start' in this.props.viewport && 'end' in this.props.viewport ? PLAYBACKMODE_ON_DEMAND : PLAYBACKMODE_LIVE;
      this.state = {
        playbackMode: updatedPlaybackMode,
      };
      this.setVideoPlayerStartAndEndTime(this.props.viewport, this.state.playbackMode);
    }
    this.updateVideoSource(prevProps, prevStates);
  };

  componentWillUnmount = () => {
    if (this.videoPlayer) {
      this.videoPlayer.dispose();
    }
    clearTimeout(this.triggerLiveVideoRequesttimeout);
    clearTimeout(this.waitForLiveTimeout);
  };

  componentDidMount = () => {
    this.setPlayer();
    this.updateVideoSource();
  };

  private setPlayer = () => {
    if (!this.domRef.current) return;
    this.videoPlayer = videojs(this.domRef.current, videoJsOptions, this.videoPlayerReady);
  };

  // Callback method when the video player is ready - Update the player controls here
  private videoPlayerReady = () => {
    const currentPlayer = videojs.getPlayer(this.videoPlayerId);
    if (currentPlayer) {
      const playToggle = currentPlayer.controlBar.getChild('playToggle');
      const liveButton = currentPlayer.controlBar.addChild('button');
      const liveButtonDom = liveButton.el() as HTMLElement;
      if (liveButtonDom && playToggle) {
        playToggle?.el().after(liveButtonDom);
        const toggleButtonId = `tb-${this.videoPlayerId}`;
        liveButtonDom.innerHTML = DOMPurify.sanitize(getLiveToggleButton(toggleButtonId));
        this.liveToggleButtonId = liveButton.id();
        this.liveToggleButton = document.getElementById(toggleButtonId) as HTMLButtonElement;
        liveButtonDom.onclick = () => {
          this.togglePlaybackMode();
        };
        this.setLiveToggleButtonStyle();
      }
      currentPlayer.hasStarted(true);
      currentPlayer.on('timeupdate', () => {
        this.videoProgressUpdate();
      });
      currentPlayer.on('ended', () => {
        this.playNextVideo();
      });
      currentPlayer.on('play', () => {
        this.playVideo();
      });
    }
  };

  private togglePlaybackMode = () => {
    this.togglingPlaybackMode = true;
    clearTimeout(this.triggerLiveVideoRequesttimeout);
    clearTimeout(this.waitForLiveTimeout);
    const newPlaybackMode =
      this.state.playbackMode === PLAYBACKMODE_ON_DEMAND ? PLAYBACKMODE_LIVE : PLAYBACKMODE_ON_DEMAND;
    // In case of video player initialized with live mode, set end time to now
    // This will play the video from the time it started till now when toggling to on-demand mode
    if ('duration' in this.props.viewport && newPlaybackMode === PLAYBACKMODE_ON_DEMAND) {
      this.endTime = new Date();
    }
    this.setState({ playbackMode: newPlaybackMode });
    this.updateVideoSource(this.props);
    this.togglingPlaybackMode = false;
  };

  private setLiveToggleButtonStyle = () => {
    if (this.liveToggleButton) {
      this.liveToggleButton.style.backgroundColor =
        this.state.playbackMode === PLAYBACKMODE_ON_DEMAND ? ondemandButtonBackground : liveButtonBackground;
    }
  };

  private setVideoPlayerStartAndEndTime = (viewport: Viewport, playbackMode: string) => {
    const { start, end } = getStartAndEndTimeForVideo(viewport, playbackMode);
    this.startTime = start;
    this.endTime = end;
  };

  private setVideoPlayerCustomeProgressBar = () => {
    const currentPlayer = videojs.getPlayer(this.videoPlayerId);
    if (currentPlayer && this.startTime && this.endTime) {
      // Remove the default progress bar if exists
      const progressControlDefault = currentPlayer.controlBar.getChild('progressControl');
      if (progressControlDefault) {
        currentPlayer.controlBar.removeChild(progressControlDefault);
      }
      // Remove the current progress bar if exists
      const progressControlPrev = currentPlayer.controlBar.getChildById(this.progressControlId);
      if (progressControlPrev) {
        currentPlayer.controlBar.removeChild(progressControlPrev);
      }
      // Add a new progress bar
      const progressControl = currentPlayer.controlBar.addChild('progressControl');
      const progressControlDom = progressControl.el() as HTMLElement;
      const playbackModeToggleBtn = currentPlayer.controlBar.getChildById(this.liveToggleButtonId);
      const startTimestamp = this.startTime.getTime();
      const endTimestamp = this.endTime.getTime();
      if (progressControlDom && playbackModeToggleBtn) {
        playbackModeToggleBtn.el().after(progressControlDom);
        this.progressControlId = progressControl.id();
        const timelineId = `tl-${this.videoPlayerId}`;
        const playProgressId = `pp-${this.videoPlayerId}`;
        const currentTimeIndicatorId = `cti-${this.videoPlayerId}`;
        progressControlDom.innerHTML = DOMPurify.sanitize(
          customVideoProgressBar({
            currentTimeIndicatorId,
            timelineId,
            playProgressId,
            timerangesWithSource: this.timerangesWithSource,
            timerangesForVideoOnEdge: this.timerangesForVideoOnEdge,
            startTimestamp,
            endTimestamp,
          })
        );
        this.progressBar = document.getElementById(timelineId) as HTMLDivElement;
        this.subscribeToSeekEvent();
        this.seekbar = document.getElementById(playProgressId) as HTMLElement;
        this.currentTimeIndicator = document.getElementById(currentTimeIndicatorId) as HTMLElement;
        this.displayCurrentTimeOnProgressIndicator();
        this.displayTimeOnProgressBar();
      }
    }
  };

  private setVideoPlayerDefaultProgressBar = () => {
    const currentPlayer = videojs.getPlayer(this.videoPlayerId);
    if (currentPlayer) {
      // Remove the custom progress bar if exists
      const progressControlPrev = currentPlayer.controlBar.getChildById(this.progressControlId);
      if (progressControlPrev) {
        currentPlayer.controlBar.removeChild(progressControlPrev);
      }
      // Add the default progress bar if not exists
      const progressControlDefault = currentPlayer.controlBar.getChild('progressControl');
      if (progressControlDefault === undefined) {
        const progressControl = currentPlayer.controlBar.addChild('progressControl');
        const progressControlDom = progressControl.el();
        const playbackModeToggleBtn = currentPlayer.controlBar.getChildById(this.liveToggleButtonId);
        if (playbackModeToggleBtn) {
          playbackModeToggleBtn.el().after(progressControlDom);
        }
      }
    }
  };

  private subscribeToSeekEvent = () => {
    if (this.progressBar) {
      this.progressBar.onclick = (ev: MouseEvent) => {
        if (this.progressBar) {
          this.isVideoSeeking = true;
          ev.preventDefault();
          const mouseX = ev.clientX;
          const rect = this.progressBar.getBoundingClientRect();
          const { x, width } = rect;
          const percentage = (mouseX - x) / width;
          // Set video to start if click is before the start time
          if (percentage > 0) {
            this.seekVideo(percentage);
          } else {
            this.seekVideo(0);
          }
        }
      };
      // Supress the default seek event of the videoJS progress control
      this.progressBar.onmousedown = (ev: MouseEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
    }
  };

  private displayTimeOnProgressBar = () => {
    if (this.progressBar) {
      this.progressBar.onmousemove = (ev: MouseEvent) => {
        if (this.progressBar && this.startTime && this.endTime) {
          const startTimeMs = this.startTime.getTime();
          const endTimeMs = this.endTime.getTime();
          const rect = this.progressBar.getBoundingClientRect();
          const seekTime = getNewSeekTime(ev.clientX, rect, startTimeMs, endTimeMs);
          this.progressBar.title = getVideoProgressTooltip(seekTime, startTimeMs);
        }
      };
    }
  };

  private displayCurrentTimeOnProgressIndicator = () => {
    if (this.seekbar) {
      this.seekbar.onmousemove = (ev: MouseEvent) => {
        this.setSeekBarTooltip(ev.clientX);
      };
      this.seekbar.onmouseover = (ev: MouseEvent) => {
        this.setSeekBarTooltip(ev.clientX);
      };
    }
  };

  private setSeekBarTooltip = (newXPosition: number) => {
    if (this.seekbar && this.startTime && this.endTime) {
      const startTimeMs = this.startTime.getTime();
      const endTimeMs = this.endTime.getTime();
      const rect = this.progressBar.getBoundingClientRect();
      const seekTime = getNewSeekTime(newXPosition, rect, startTimeMs, endTimeMs);
      this.seekbar.title = getVideoProgressTooltip(seekTime, startTimeMs);
    }
  };

  private displayCurrentTime = () => {
    if (this.currentOnDemandSource && this.videoPlayer && this.currentTimeIndicator && this.startTime && this.endTime) {
      const startTimestamp = this.startTime.getTime();
      const endTimestamp = this.endTime.getTime();
      const percentage = getVideoProgressPercentage(
        this.currentOnDemandSource.start,
        this.videoPlayer.currentTime(),
        startTimestamp,
        endTimestamp
      );
      const seekTime = getVideoProgressSeekTime(percentage, startTimestamp, endTimestamp);
      this.currentTimeIndicator.textContent = getFormattedDateTime(new Date(seekTime));
    }
  };

  private updateSeekbarPosition = (newPositionPercentage: number) => {
    // Do not update the play progress position while the video is being seeked
    if (this.progressBar && this.seekbar && !this.isVideoSeeking) {
      const rect = this.progressBar.getBoundingClientRect();
      const { width } = rect;
      const left = (((width * newPositionPercentage) / 100 - 5) / width) * 100;
      this.seekbar.style.left = left + '%';
    }
  };

  private videoProgressUpdate = () => {
    if (this.state.playbackMode === PLAYBACKMODE_ON_DEMAND && this.videoPlayer && this.currentOnDemandSource) {
      const percentage = getVideoProgressPercentage(
        this.currentOnDemandSource.start,
        this.videoPlayer.currentTime(),
        this.startTime.getTime(),
        this.endTime.getTime()
      );
      this.updateSeekbarPosition(percentage);
      this.displayCurrentTime();
    }
  };

  private playNextVideo = () => {
    if (this.state.playbackMode === PLAYBACKMODE_ON_DEMAND && this.timerangesWithSource.length > 0) {
      if (this.currentOnDemandSource) {
        // Get the next video information
        const currentSourceIndex = this.timerangesWithSource.indexOf(this.currentOnDemandSource);
        if (currentSourceIndex < this.timerangesWithSource.length - 1) {
          this.setCurrentSourceForOnDemand(this.timerangesWithSource[currentSourceIndex + 1]);
        } else {
          // Reset the video source if all the videos are done playing
          this.currentOnDemandSource = undefined;
        }
      } else {
        this.setCurrentSourceForOnDemand(this.timerangesWithSource[0]);
      }
    }
  };

  // Automatically play the next video in the source list
  private playVideo = () => {
    if (this.currentOnDemandSource === undefined) {
      this.playNextVideo();
    }
  };

  private seekVideo = (newPositionPercentage: number) => {
    if (this.videoPlayer && this.seekbar && this.startTime && this.endTime) {
      const seekTime = getVideoProgressSeekTime(
        newPositionPercentage,
        this.startTime.getTime(),
        this.endTime.getTime()
      );
      const newSource = this.timerangesWithSource.find(({ start, end }) => seekTime >= start && seekTime < end);
      if (newSource) {
        this.setCurrentSourceForOnDemand(newSource);
        this.updateSeekbarPosition(newPositionPercentage);
        this.videoPlayer.currentTime((seekTime - newSource.start) / 1000);
        this.displayCurrentTime();
      } else {
        // No video available
        this.videoPlayer.pause();
        const nextSource = this.timerangesWithSource.find(({ start }) => seekTime < start);
        this.isVideoSeeking = false;
        this.updateSeekbarPosition(newPositionPercentage);
        this.displayCurrentTime();
        let noVideoMessage = noVideoAvailableMessage;
        const videoOnEdge = this.timerangesForVideoOnEdge.find(({ start, end }) => seekTime >= start && seekTime < end);
        if (videoOnEdge) {
          noVideoMessage = videoOnEdgeMessage;
        }
        const noVideo = document.createElement('div');
        noVideo.innerHTML = DOMPurify.sanitize(`<p style='${noVideoAvailableStyle}'>${noVideoMessage}</p>`);
        const noVideoModal = this.videoPlayer.createModal(noVideo, null);
        // When the modal closes, resume playback.
        noVideoModal.on('modalclose', () => {
          const currentPlayer = videojs.getPlayer(this.videoPlayerId);
          if (currentPlayer && nextSource) {
            currentPlayer.src(nextSource.src);
            currentPlayer.play();
          }
        });
        if (nextSource) {
          this.currentOnDemandSource = nextSource;
        }
      }
    }
  };

  private setCurrentSourceForOnDemand = (newSource: { start: number; end: number; src: string }) => {
    if (this.videoPlayer && newSource) {
      if (this.currentOnDemandSource !== newSource) {
        this.currentOnDemandSource = newSource;
        const prevPlaybackRate = this.videoPlayer.playbackRate();
        this.closeErrorDialogAndSetSource(this.currentOnDemandSource.src);
        // Play the video and preserve the playback rate selected by the user
        this.videoPlayer.play()?.then(() => {
          this.videoPlayer?.playbackRate(prevPlaybackRate);
          this.isVideoSeeking = false;
        });
      } else {
        this.videoPlayer.play()?.then(() => {
          this.isVideoSeeking = false;
        });
      }
    }
  };

  private triggerLiveVideoUpload = async () => {
    await this.props.videoData.triggerLiveVideoUpload();
    clearTimeout(this.triggerLiveVideoRequesttimeout);
    this.triggerLiveVideoRequesttimeout = setTimeout(this.triggerLiveVideoUpload, this.uploadLiveVideoTimer);
  };

  private updateVideoSource = (prevProps?: IVideoPlayerProps, prevStates?: IVideoPlayerState) => {
    if (this.videoPlayer) {
      this.videoPlayer.reset();
    }

    if (prevProps && prevStates && this.propertiesNotChanged(prevProps, prevStates)) return;

    const playbackMode = this.state.playbackMode;
    if (playbackMode === PLAYBACKMODE_LIVE) {
      this.setVideoPlayerForLiveMode();
    } else if (playbackMode === PLAYBACKMODE_ON_DEMAND) {
      this.timerangesWithSource = [];
      this.setVideoPlayerForOnDemandMode();
    }
    this.setLiveToggleButtonStyle();
  };

  private propertiesNotChanged = (prevProps: IVideoPlayerProps, prevStates: IVideoPlayerState) => {
    const currentTime = new Date();
    return (
      this.props.videoData === prevProps.videoData &&
      viewportStartDate(this.props.viewport, currentTime).getTime() ===
        viewportStartDate(prevProps.viewport, currentTime).getTime() &&
      viewportEndDate(this.props.viewport, currentTime).getTime() ===
        viewportEndDate(prevProps.viewport, currentTime).getTime() &&
      'duration' in this.props.viewport === 'duration' in prevProps.viewport &&
      this.state.playbackMode === prevStates.playbackMode
    );
  };

  private displayVideoPlayerError = (errorMessage: string) => {
    if (this.videoPlayer && !this.videoPlayer.isDisposed()) {
      this.videoPlayer.pause();
      if (this.videoErrorDialog) {
        this.videoErrorDialog.close();
      }
      const videoErrorEl = document.createElement('div') as HTMLElement;
      videoErrorEl.innerHTML = DOMPurify.sanitize(`<p style='${noVideoAvailableStyle}'>${errorMessage}</p>`);
      this.videoErrorDialog = this.videoPlayer.createModal(videoErrorEl, null);
    }
  };

  private errorHandlingForLiveMode = (errorMessage: string) => {
    this.displayVideoPlayerError(errorMessage);
    // Keep checking for the video if not found in live mode
    clearTimeout(this.waitForLiveTimeout);
    this.waitForLiveTimeout = setTimeout(this.setVideoPlayerForLiveMode, 10000);
  };

  private closeErrorDialogAndSetSource = (source: string | videojs.Tech.SourceObject | videojs.Tech.SourceObject[]) => {
    if (this.videoPlayer) {
      if (this.videoErrorDialog) {
        this.videoErrorDialog.close();
      }
      this.videoPlayer.src(source);
    }
  };

  private setVideoPlayerForLiveMode = async () => {
    try {
      // First check if Live stream is available or not and then trigger the video upload request
      const kvsStreamSrc = await this.props.videoData.getKvsStreamSrc(PLAYBACKMODE_LIVE);
      if (kvsStreamSrc) {
        this.closeErrorDialogAndSetSource(kvsStreamSrc);
        // Request live video upload every 2 minutes
        this.triggerLiveVideoUpload();
      }
    } catch (error) {
      this.errorHandlingForLiveMode(error);
    }
  };

  private setVideoPlayerForOnDemandMode = async () => {
    try {
      // Reset the current source
      this.currentOnDemandSource = undefined;
      const kvsStreamSrc = await this.props.videoData.getKvsStreamSrc(
        PLAYBACKMODE_ON_DEMAND,
        this.startTime,
        this.endTime
      );

      if (kvsStreamSrc) {
        await this.getAvailableTimeRangesAndSetVideoSource();
        if (this.currentOnDemandSource) {
          // EdgeVideo Component Type
          this.closeErrorDialogAndSetSource(
            (this.currentOnDemandSource as { start: number; end: number; src: string }).src
          );
          this.timerangesForVideoOnEdge = filterTimerangesForVideoOnEdge(
            this.timerangesForVideoOnEdgeRaw,
            this.timerangesWithSource
          );
          this.setVideoPlayerCustomeProgressBar();
        } else {
          // KVS Component Type Or Simple Mode Video Player
          this.setVideoPlayerDefaultProgressBar();
          this.closeErrorDialogAndSetSource(kvsStreamSrc);
        }
      }
    } catch (error) {
      this.displayVideoPlayerError(error);
    }
  };

  private getAvailableTimeRangesAndSetVideoSource = async () => {
    const timeRanges = await this.props.videoData.getAvailableTimeRanges(this.startTime, this.endTime);
    if (timeRanges) {
      this.timerangesWithSource = timeRanges[0];
      this.timerangesForVideoOnEdgeRaw = timeRanges[1];
      if (this.currentOnDemandSource === undefined) {
        this.currentOnDemandSource = this.timerangesWithSource[0];
      }
    }
  };

  render() {
    return (
      // NOTE: We have an additional div as a workaround to fix "NotFoundError: The node to be removed is not a child of this node"  error
      /* References:
        https://stackoverflow.com/questions/24305963/js-error-the-node-to-be-removed-is-not-a-child-of-this-node
        https://stackoverflow.com/questions/48358529/failed-to-execute-removechild-on-node-with-fontawesome-in-react
      */
      <div>
        <video id={this.videoPlayerId} ref={this.domRef} className="video-js vjs-big-play-centered">
          <track kind="captions" />
          <p className="vjs-no-js">{html5NotSupportedMessage}</p>
        </video>
      </div>
    );
  }
}
