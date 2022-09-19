import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { RequestVideoUpload } from './requestVideoUpload';
import { mockVideoData } from './__mocks__/MockVideoPlayerProps';
import wrapper from '@awsui/components-react/test-utils/dom';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

const triggerVideoUploadRequestFn = jest
  .spyOn(mockVideoData, 'triggerOnDemandVideoUploadRequest')
  .mockImplementation(() => null as unknown);

it('should render RequestVideoUpload Button', () => {
  render(<RequestVideoUpload videoData={mockVideoData} />);
  expect(screen.queryByTestId('video-upload-request-button')).toBeDefined();
});

it('should trigger video upload request', () => {
  const { container } = render(<RequestVideoUpload videoData={mockVideoData} />);
  const uiComponentWrapper = wrapper(container as HTMLElement);

  expect(screen.queryByTestId('video-upload-request-button')).toBeDefined();

  const dateRangePicker = uiComponentWrapper?.findContainer()?.findContent()?.findDateRangePicker();
  dateRangePicker?.openDropdown();
  const dropDown = dateRangePicker?.findDropdown();

  const relativeRangeRadioGroup = dropDown?.findRelativeRangeRadioGroup();
  relativeRangeRadioGroup?.findButtons()[0].findNativeInput().click();
  dropDown?.findApplyButton().click();

  fireEvent.click(screen.getByText('Request Video'));
  expect(triggerVideoUploadRequestFn).toBeCalled();
});
