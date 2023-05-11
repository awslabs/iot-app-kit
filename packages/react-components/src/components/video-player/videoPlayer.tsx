// VideoJS exports as a single namespace
/* eslint-disable import/no-named-as-default-member */
import DOMPurify from 'dompurify';
import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import videojs from 'video.js';
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
import { getFormattedDateTime, getNewSeekTime, getStartAndEndTimeForVideo } from './utils/dateTimeUtils';
import { filterTimerangesForVideoOnEdge } from './utils/filterTimeRanges';
import { customVideoProgressBar } from './customVideoProgressBar';
import { getLiveToggleButton } from './utils/getLiveToggleButton';
import {
  getVideoProgressPercentage,
  getVideoProgressSeekTime,
  getVideoProgressTooltip,
} from './utils/videoProgressUtils';
import type { IVideoPlayerProps, VideoTimeRanges, VideoTimeRangesWithSource } from './types';
import type { Viewport, HistoricalViewport } from '@iot-app-kit/core';
import type VideoJsPlayer from 'video.js/dist/types/player';
import type ControlBar from 'video.js/dist/types/component';

type currentOnDemandSource = {
  start: number;
  end: number;
  src: string;
};

// TODO: Restore tests to work with new implementation post-live fix
// it('sets video player for LIVE playback mode', async () => {
// it('throws exception when setting video player for LIVE playback mode', async () => {
// it('sets video player for ON_DEMAND playback mode', async () => {
// it('sets video player for ON_DEMAND playback mode with KVS component type (No available time ranges)', async () => {
// it('should not update session URL when fields are the same for on demand mode', async () => {
// it('should not update session URL when fields are the same for live mode', async () => {
// it('should update session URL when playback mode changes', async () => {

export const VideoPlayer = (props: IVideoPlayerProps) => {
  const { viewport, videoData } = props;
  const { start, end } = viewport as HistoricalViewport;
  const [startTime, setStartTime] = useState<Date>(start);
  const [endTime, setEndTime] = useState<Date | undefined>(end);
  const domRef = useRef<HTMLVideoElement>(null);
  const [liveToggleButtonId, setLiveToggleButtonId] = useState<string>('');
  const [progressControlId, setProgressControlId] = useState<string>('');
  const [liveToggleButton, setLiveToggleButton] = useState<HTMLButtonElement>();
  const [timerangesWithSource, setTimerangesWithSource] = useState<VideoTimeRangesWithSource>([]);
  const [timerangesForVideoOnEdgeRaw, setTimerangesForVideoOnEdgeRaw] = useState<VideoTimeRanges>([]);
  const [timerangesForVideoOnEdge, setTimerangesForVideoOnEdge] = useState<VideoTimeRanges>([]);
  const videoPlayerId = 'iot-' + uuid();
  const initialPlaybackMode = 'start' in viewport && 'end' in viewport ? PLAYBACKMODE_ON_DEMAND : PLAYBACKMODE_LIVE;
  const [playbackMode, setPlaybackMode] = useState<typeof PLAYBACKMODE_ON_DEMAND | typeof PLAYBACKMODE_LIVE>(
    initialPlaybackMode
  );
  const [videoPlayer, setVideoPlayer] = useState<ReturnType<typeof videojs>>();
  const [videoErrorDialog, setVideoErrorDialog] = useState<ReturnType<ReturnType<typeof videojs>['createModal']>>();
  // Boolean flag to keep track if video is seeked by the user explicitly
  const [isVideoSeeking, setIsVideoSeeking] = useState<boolean>(false);
  let triggerLiveVideoRequesttimeout: ReturnType<typeof setTimeout> | undefined;
  const uploadLiveVideoTimer = 120000; // 2 minutes timer in milli seconds to trigger live video upload every 2 minutes
  const [currentOnDemandSource, setCurrentOnDemandSource] = useState<currentOnDemandSource>();
  let waitForLiveTimeout: ReturnType<typeof setTimeout> | undefined;
  // Skip playback mode updates if it is manually toggled by user
  const [togglingPlaybackMode, setTogglingPlaybackMode] = useState<boolean>(true);
  const [progressBar, setProgressBar] = useState<HTMLDivElement>();
  const [seekBar, setSeekBar] = useState<HTMLElement>();
  const [currentTimeIndicator, setCurrentTimeIndicator] = useState<HTMLElement>();

  useEffect(() => {
    setVideoPlayerStartAndEndTime(viewport, initialPlaybackMode);
    setPlayer();
    updateVideoSource();
  }, []);

  useEffect(() => {
    if (!videoPlayer) return;
    updateVideoSource();
  }, [videoPlayer]);

  useEffect(() => {
    if (!togglingPlaybackMode) setVideoPlayerStartAndEndTime(viewport, playbackMode);
    updateVideoSource();
  }, [togglingPlaybackMode]);

  const createPlayer = () => {
    return videojs.getPlayer(videoPlayerId) as unknown as VideoJsPlayer & { controlBar: ControlBar };
  };

  const setPlayer = () => {
    if (!domRef.current) return;
    setVideoPlayer(videojs(domRef.current, videoJsOptions, videoPlayerReady));
  };

  const setVideoPlayerStartAndEndTime = (viewport: Viewport, playbackMode: string) => {
    const { start, end } = getStartAndEndTimeForVideo(viewport, playbackMode);
    setStartTime(start);
    setEndTime(end);
  };

  // Callback method when the video player is ready - Update the player controls here
  const videoPlayerReady = () => {
    const currentPlayer = createPlayer();
    if (currentPlayer) {
      const hasButton = currentPlayer.controlBar.getChild('button');
      if (hasButton) return;
      const playToggle = currentPlayer.controlBar.getChild('playToggle');
      const liveButton = currentPlayer.controlBar.addChild('button');
      const liveButtonDom = liveButton.el() as HTMLElement;
      if (liveButtonDom && playToggle) {
        playToggle?.el().after(liveButtonDom);
        const toggleButtonId = `tb-${videoPlayerId}`;
        liveButtonDom.innerHTML = DOMPurify.sanitize(getLiveToggleButton(toggleButtonId));
        setLiveToggleButtonId(liveButton.id());
        setLiveToggleButton(document.getElementById(toggleButtonId) as HTMLButtonElement);
        liveButtonDom.onclick = () => {
          togglePlaybackMode();
        };
        setLiveToggleButtonStyle();
      }
      currentPlayer.hasStarted(true);
      currentPlayer.on('timeupdate', () => {
        videoProgressUpdate();
      });
      currentPlayer.on('ended', () => {
        playNextVideo();
      });
      currentPlayer.on('play', () => {
        playVideo();
      });
    }
  };

  const togglePlaybackMode = () => {
    if (triggerLiveVideoRequesttimeout != null) clearTimeout(triggerLiveVideoRequesttimeout);
    if (waitForLiveTimeout != null) clearTimeout(waitForLiveTimeout);
    const newPlaybackMode = playbackMode === PLAYBACKMODE_ON_DEMAND ? PLAYBACKMODE_LIVE : PLAYBACKMODE_ON_DEMAND;
    // In case of video player initialized with live mode, set end time to now
    // This will play the video from the time it started till now when toggling to on-demand mode
    if ('duration' in viewport && newPlaybackMode === PLAYBACKMODE_ON_DEMAND) {
      setEndTime(new Date());
    }
    setPlaybackMode(newPlaybackMode);
    setTogglingPlaybackMode(false);
  };

  const setLiveToggleButtonStyle = () => {
    if (liveToggleButton) {
      liveToggleButton.style.backgroundColor =
        playbackMode === PLAYBACKMODE_ON_DEMAND ? ondemandButtonBackground : liveButtonBackground;
    }
  };

  const setVideoPlayerCustomeProgressBar = () => {
    const currentPlayer = createPlayer();
    if (currentPlayer && startTime && endTime) {
      // Remove the default progress bar if exists
      const progressControlDefault = currentPlayer.controlBar.getChild('progressControl');
      if (progressControlDefault) {
        currentPlayer.controlBar.removeChild(progressControlDefault);
      }
      // Remove the current progress bar if exists
      const progressControlPrev = currentPlayer.controlBar.getChildById(progressControlId);
      if (progressControlPrev) {
        currentPlayer.controlBar.removeChild(progressControlPrev);
      }
      // Add a new progress bar
      const progressControl = currentPlayer.controlBar.addChild('progressControl');
      const progressControlDom = progressControl.el() as HTMLElement;
      const playbackModeToggleBtn = currentPlayer.controlBar.getChildById(liveToggleButtonId);
      const startTimestamp = startTime.getTime();
      const endTimestamp = endTime.getTime();
      if (progressControlDom && playbackModeToggleBtn) {
        playbackModeToggleBtn.el().after(progressControlDom);
        setProgressControlId(progressControl.id());
        const timelineId = `tl-${videoPlayerId}`;
        const playProgressId = `pp-${videoPlayerId}`;
        const currentTimeIndicatorId = `cti-${videoPlayerId}`;
        progressControlDom.innerHTML = DOMPurify.sanitize(
          customVideoProgressBar({
            currentTimeIndicatorId,
            timelineId,
            playProgressId,
            timerangesWithSource: timerangesWithSource,
            timerangesForVideoOnEdge: timerangesForVideoOnEdge,
            startTimestamp,
            endTimestamp,
          })
        );
        setProgressBar(document.getElementById(timelineId) as HTMLDivElement);
        subscribeToSeekEvent();
        setSeekBar(document.getElementById(playProgressId) as HTMLElement);
        setCurrentTimeIndicator(document.getElementById(currentTimeIndicatorId) as HTMLElement);
        displayCurrentTimeOnProgressIndicator();
        displayTimeOnProgressBar();
      }
    }
  };

  const setVideoPlayerDefaultProgressBar = () => {
    const currentPlayer = createPlayer();
    if (currentPlayer) {
      // Remove the custom progress bar if exists
      const progressControlPrev = currentPlayer.controlBar.getChildById(progressControlId);
      if (progressControlPrev) {
        currentPlayer.controlBar.removeChild(progressControlPrev);
      }
      // Add the default progress bar if not exists
      const progressControlDefault = currentPlayer.controlBar.getChild('progressControl');
      if (progressControlDefault === undefined) {
        const progressControl = currentPlayer.controlBar.addChild('progressControl');
        const progressControlDom = progressControl.el();
        const playbackModeToggleBtn = currentPlayer.controlBar.getChildById(liveToggleButtonId);
        if (playbackModeToggleBtn) {
          playbackModeToggleBtn.el().after(progressControlDom);
        }
      }
    }
  };

  const subscribeToSeekEvent = () => {
    if (progressBar) {
      progressBar.onclick = (ev: MouseEvent) => {
        if (progressBar) {
          setIsVideoSeeking(true);
          ev.preventDefault();
          const mouseX = ev.clientX;
          const rect = progressBar.getBoundingClientRect();
          const { x, width } = rect;
          const percentage = ((mouseX - x) / width) * 100;
          // Set video to start if click is before the start time
          if (percentage > 0) {
            seekVideo(percentage);
          } else {
            seekVideo(0);
          }
        }
      };
      // Supress the default seek event of the videoJS progress control
      progressBar.onmousedown = (ev: MouseEvent) => {
        ev.stopPropagation();
        ev.preventDefault();
      };
    }
  };

  const displayTimeOnProgressBar = () => {
    if (progressBar) {
      progressBar.onmousemove = (ev: MouseEvent) => {
        if (progressBar && startTime && endTime) {
          const startTimeMs = startTime.getTime();
          const endTimeMs = endTime.getTime();
          const rect = progressBar.getBoundingClientRect();
          const seekTime = getNewSeekTime(ev.clientX, rect, startTimeMs, endTimeMs);
          progressBar.title = getVideoProgressTooltip(seekTime, startTimeMs);
        }
      };
    }
  };

  const displayCurrentTimeOnProgressIndicator = () => {
    if (seekBar) {
      seekBar.onmousemove = (ev: MouseEvent) => {
        setSeekBarTooltip(ev.clientX);
      };
      seekBar.onmouseover = (ev: MouseEvent) => {
        setSeekBarTooltip(ev.clientX);
      };
    }
  };

  const setSeekBarTooltip = (newXPosition: number) => {
    if (seekBar && startTime && endTime) {
      const startTimeMs = startTime.getTime();
      const endTimeMs = endTime.getTime();
      if (progressBar) {
        const rect = progressBar.getBoundingClientRect();
        const seekTime = getNewSeekTime(newXPosition, rect, startTimeMs, endTimeMs);
        seekBar.title = getVideoProgressTooltip(seekTime, startTimeMs);
      }
    }
  };

  const displayCurrentTime = () => {
    if (currentOnDemandSource && videoPlayer && currentTimeIndicator && startTime && endTime) {
      const startTimestamp = startTime.getTime();
      const endTimestamp = endTime.getTime();
      const percentage = getVideoProgressPercentage(
        currentOnDemandSource.start,
        videoPlayer.currentTime(),
        startTimestamp,
        endTimestamp
      );
      const seekTime = getVideoProgressSeekTime(percentage, startTimestamp, endTimestamp);
      currentTimeIndicator.textContent = getFormattedDateTime(new Date(seekTime));
    }
  };

  const updateSeekbarPosition = (newPositionPercentage: number) => {
    // Do not update the play progress position while the video is being seeked
    if (progressBar && seekBar && !isVideoSeeking) {
      const rect = progressBar.getBoundingClientRect();
      const { width } = rect;
      const left = (((width * newPositionPercentage) / 100 - 5) / width) * 100;
      seekBar.style.left = left + '%';
    }
  };

  const videoProgressUpdate = () => {
    if (playbackMode === PLAYBACKMODE_ON_DEMAND && endTime && videoPlayer && currentOnDemandSource) {
      const percentage = getVideoProgressPercentage(
        currentOnDemandSource.start,
        videoPlayer.currentTime(),
        startTime.getTime(),
        endTime.getTime()
      );
      updateSeekbarPosition(percentage);
      displayCurrentTime();
    }
  };

  const playNextVideo = () => {
    if (playbackMode === PLAYBACKMODE_ON_DEMAND && timerangesWithSource.length > 0) {
      if (currentOnDemandSource) {
        // Get the next video information
        const currentSourceIndex = timerangesWithSource.indexOf(currentOnDemandSource);
        if (currentSourceIndex < timerangesWithSource.length - 1) {
          setCurrentSourceForOnDemand(timerangesWithSource[currentSourceIndex + 1]);
        } else {
          // Reset the video source if all the videos are done playing
          setCurrentOnDemandSource(undefined);
        }
      } else {
        setCurrentSourceForOnDemand(timerangesWithSource[0]);
      }
    }
  };

  // Automatically play the next video in the source list
  const playVideo = () => {
    if (currentOnDemandSource === undefined) {
      playNextVideo();
    }
  };

  const seekVideo = (newPositionPercentage: number) => {
    if (videoPlayer && seekBar && startTime && endTime) {
      const seekTime = getVideoProgressSeekTime(newPositionPercentage, startTime.getTime(), endTime.getTime());
      const newSource = timerangesWithSource.find(({ start, end }) => seekTime >= start && seekTime < end);
      if (newSource) {
        setCurrentSourceForOnDemand(newSource);
        updateSeekbarPosition(newPositionPercentage);
        videoPlayer.currentTime((seekTime - newSource.start) / 1000);
        displayCurrentTime();
      } else {
        // No video available
        videoPlayer.pause();
        const nextSource = timerangesWithSource.find(({ start }) => seekTime < start);
        setIsVideoSeeking(false);
        updateSeekbarPosition(newPositionPercentage);
        displayCurrentTime();
        let noVideoMessage = noVideoAvailableMessage;
        const videoOnEdge = timerangesForVideoOnEdge?.find(({ start, end }) => seekTime >= start && seekTime < end);
        if (videoOnEdge) {
          noVideoMessage = videoOnEdgeMessage;
        }
        const noVideo = document.createElement('div');
        noVideo.innerHTML = DOMPurify.sanitize(`<p style='${noVideoAvailableStyle}'>${noVideoMessage}</p>`);
        const noVideoModal = videoPlayer.createModal(noVideo, null);
        // When the modal closes, resume playback.
        noVideoModal.on('modalclose', () => {
          const currentPlayer = videojs.getPlayer(videoPlayerId);
          if (currentPlayer && nextSource) {
            currentPlayer.src(nextSource.src);
            currentPlayer.play();
          }
        });
        if (nextSource) {
          setCurrentOnDemandSource(nextSource);
        }
      }
    }
  };

  const setCurrentSourceForOnDemand = (newSource: { start: number; end: number; src: string }) => {
    if (videoPlayer) {
      if (currentOnDemandSource !== newSource) {
        setCurrentOnDemandSource(newSource);
        const prevPlaybackRate = videoPlayer.playbackRate();
        closeErrorDialogAndSetVideoSource(newSource.src);
        // Play the video and preserve the playback rate selected by the user
        videoPlayer.play()?.then(() => {
          videoPlayer?.playbackRate(prevPlaybackRate);
          setIsVideoSeeking(false);
        });
      } else {
        videoPlayer.play()?.then(() => {
          setIsVideoSeeking(false);
        });
      }
    }
  };

  const triggerLiveVideoUpload = async () => {
    await videoData.triggerLiveVideoUpload();
    if (triggerLiveVideoRequesttimeout != null) {
      clearTimeout(triggerLiveVideoRequesttimeout);
    }
    triggerLiveVideoRequesttimeout = setTimeout(triggerLiveVideoUpload, uploadLiveVideoTimer);
  };

  const updateVideoSource = () => {
    if (playbackMode === PLAYBACKMODE_LIVE) {
      setVideoPlayerForLiveMode();
    } else if (playbackMode === PLAYBACKMODE_ON_DEMAND) {
      setTimerangesWithSource([]);
      setVideoPlayerForOnDemandMode();
    }
    setLiveToggleButtonStyle();
  };

  const displayVideoPlayerError = (errorMessage: string) => {
    if (videoPlayer && !videoPlayer.isDisposed()) {
      videoPlayer.pause();
      if (videoErrorDialog) {
        videoErrorDialog.close();
      }
      const videoErrorEl = document.createElement('div') as HTMLElement;
      videoErrorEl.innerHTML = DOMPurify.sanitize(`<p style='${noVideoAvailableStyle}'>${errorMessage}</p>`);
      setVideoErrorDialog(videoPlayer.createModal(videoErrorEl, null));
    }
  };

  const errorHandlingForLiveMode = (errorMessage: string) => {
    displayVideoPlayerError(errorMessage);
    // Keep checking for the video if not found in live mode
    if (waitForLiveTimeout != null) {
      clearTimeout(waitForLiveTimeout);
    }
    waitForLiveTimeout = setTimeout(setVideoPlayerForLiveMode, 10000);
  };

  const closeErrorDialogAndSetVideoSource = (source: string) => {
    if (videoPlayer) {
      if (videoErrorDialog) {
        videoErrorDialog.close();
      }
      videoPlayer.src(source);
    }
  };

  const setVideoPlayerForLiveMode = async () => {
    try {
      // First check if Live stream is available or not and then trigger the video upload request
      const kvsStreamSrc = await videoData.getKvsStreamSrc(PLAYBACKMODE_LIVE);
      if (kvsStreamSrc) {
        closeErrorDialogAndSetVideoSource(kvsStreamSrc);
        // Request live video upload every 2 minutes
        triggerLiveVideoUpload();
      }
    } catch (error) {
      errorHandlingForLiveMode(error as string);
    }
  };

  const setVideoPlayerForOnDemandMode = async () => {
    try {
      const kvsStreamSrc = await videoData.getKvsStreamSrc(PLAYBACKMODE_ON_DEMAND, startTime, endTime);
      if (kvsStreamSrc) {
        await getAvailableTimeRangesAndSetVideoSource();
        if (currentOnDemandSource) {
          // EdgeVideo Component Type
          closeErrorDialogAndSetVideoSource((currentOnDemandSource as { start: number; end: number; src: string }).src);
          setTimerangesForVideoOnEdge(
            filterTimerangesForVideoOnEdge(timerangesForVideoOnEdgeRaw, timerangesWithSource)
          );
          setVideoPlayerCustomeProgressBar();
        } else {
          // KVS Component Type Or Simple Mode Video Player
          setVideoPlayerDefaultProgressBar();
          closeErrorDialogAndSetVideoSource(kvsStreamSrc);
        }
      }
    } catch (error) {
      displayVideoPlayerError(error as string);
    }
  };

  const getAvailableTimeRangesAndSetVideoSource = async () => {
    if (endTime) {
      const timeRanges = await videoData.getAvailableTimeRanges(startTime, endTime);
      if (timeRanges) {
        setTimerangesWithSource(timeRanges[0]);
        setTimerangesForVideoOnEdgeRaw(timeRanges[1]);
        setCurrentOnDemandSource(timerangesWithSource[0]);
      }
    }
  };

  return (
    <video
      id={videoPlayerId}
      ref={domRef}
      className='video-js vjs-big-play-centered'
      autoPlay={true}
      src={currentOnDemandSource?.src}
      preload='auto'
      muted={true}
    >
      <track kind='captions' />
      <p className='vjs-no-js'>{html5NotSupportedMessage}</p>
    </video>
  );
};
