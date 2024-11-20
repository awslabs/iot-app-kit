import { type ThresholdStyleType } from '@iot-app-kit/core';
import { render, screen } from '@testing-library/react';
import ue from '@testing-library/user-event';
import {
  convertOptionToThresholdStyle,
  convertThresholdStyleToOption,
  styledOptions,
} from './defaultThresholds';
import { ThresholdStyleSettings } from './thresholdStyle';

const thresholdStyle: ThresholdStyleType = {
  visible: true,
};
const mockUpdateAllThresholdStyles = vi.fn();
const user = ue.setup();

const component = (
  <ThresholdStyleSettings
    thresholdStyle={thresholdStyle}
    updateAllThresholdStyles={mockUpdateAllThresholdStyles}
    convertOptionToThresholdStyle={convertOptionToThresholdStyle}
    convertThresholdStyleToOption={convertThresholdStyleToOption}
    styledOptions={styledOptions}
  />
);

test('user changes threshold style', async () => {
  render(component);

  expect(screen.getByLabelText('Show thresholds')).toHaveTextContent(
    'As lines'
  );
  expect(
    screen.queryByRole('option', { name: 'As lines' })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('option', { name: 'As filled region' })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('option', {
      name: 'As lines and filled region',
    })
  ).not.toBeInTheDocument();

  await user.click(screen.getByLabelText('Show thresholds'));

  expect(
    screen.getByRole('option', { name: 'As lines', selected: true })
  ).toBeVisible();
  expect(
    screen.getByRole('option', { name: 'As filled region', selected: false })
  ).toBeVisible();
  expect(
    screen.getByRole('option', {
      name: 'As lines and filled region',
      selected: false,
    })
  ).toBeVisible();

  await user.click(
    screen.getByRole('option', { name: 'As filled region', selected: false })
  );

  expect(screen.getByLabelText('Show thresholds')).toHaveTextContent(
    'As filled region'
  );
  expect(mockUpdateAllThresholdStyles).toBeCalled();
  expect(
    screen.queryByRole('option', { name: 'As lines' })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('option', { name: 'As filled region' })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole('option', {
      name: 'As lines and filled region',
    })
  ).not.toBeInTheDocument();

  await user.click(screen.getByLabelText('Show thresholds'));

  expect(
    screen.getByRole('option', { name: 'As lines', selected: false })
  ).toBeVisible();
  expect(
    screen.getByRole('option', { name: 'As filled region', selected: true })
  ).toBeVisible();
  expect(
    screen.getByRole('option', {
      name: 'As lines and filled region',
      selected: false,
    })
  ).toBeVisible();
});
