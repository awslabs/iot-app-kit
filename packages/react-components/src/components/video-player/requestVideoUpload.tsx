import {
  Button,
  DateRangePicker,
  SpaceBetween,
} from '@cloudscape-design/components';
import React, { Component } from 'react';
import { i18nStrings, requestVideoButtonLabel } from './constants';
import { getStartAndEndTimeFromRange } from './utils/dateRangeUtils';
import type { DateRangePickerProps } from '@cloudscape-design/components';
import type {
  IVideoUploadRequestProps,
  IVideoUploadRequestState,
} from './types';

export class RequestVideoUpload extends Component<
  IVideoUploadRequestProps,
  IVideoUploadRequestState
> {
  private uploadStartTime = '';
  private uploadEndTime = '';

  constructor(props: IVideoUploadRequestProps) {
    super(props);
    this.state = { videoUploadDateRange: undefined };
  }

  // Set the start and end time for the video upload request
  setUploadDateRange = (
    newDateRange:
      | DateRangePickerProps.AbsoluteValue
      | DateRangePickerProps.RelativeValue
      | undefined
  ) => {
    this.setState({
      videoUploadDateRange: newDateRange,
    });

    const newUploadTimeFromRange = getStartAndEndTimeFromRange(
      newDateRange,
      new Date()
    );
    if (newUploadTimeFromRange) {
      this.uploadStartTime = newUploadTimeFromRange.startTime as string;
      this.uploadEndTime = newUploadTimeFromRange.endTime;
    }
  };

  render() {
    return (
      <div id='video-upload-request-ui' style={{ marginTop: 30 }}>
        <SpaceBetween direction='horizontal' size='xs'>
          <DateRangePicker
            isValidRange={() => ({ valid: true })}
            relativeOptions={[
              {
                key: 'previous-5-minutes',
                amount: 5,
                unit: 'minute',
                type: 'relative',
              },
              {
                key: 'previous-30-minutes',
                amount: 30,
                unit: 'minute',
                type: 'relative',
              },
              {
                key: 'previous-1-hour',
                amount: 1,
                unit: 'hour',
                type: 'relative',
              },
              {
                key: 'previous-6-hours',
                amount: 6,
                unit: 'hour',
                type: 'relative',
              },
            ]}
            i18nStrings={i18nStrings}
            onChange={({ detail }) => {
              if (detail.value != null) {
                this.setUploadDateRange(detail.value);
              }
            }}
            value={
              this.state.videoUploadDateRange as
                | DateRangePickerProps.RelativeValue
                | DateRangePickerProps.AbsoluteValue
            }
            placeholder='Select a date and time range'
          />
          <Button
            data-testid='video-upload-request-button'
            variant='normal'
            onClick={() =>
              this.props.videoData.triggerOnDemandVideoUploadRequest(
                this.uploadStartTime,
                this.uploadEndTime
              )
            }
          >
            {requestVideoButtonLabel}
          </Button>
        </SpaceBetween>
      </div>
    );
  }
}
