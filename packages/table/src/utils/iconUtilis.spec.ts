import { STATUS_ICON_TYPE, StatusIconType } from '@iot-app-kit/core';
import { getIcons } from './iconUtils';

describe('sets default pixel size', () => {
  it('renders ACTIVE icon at correct default size', () => {
    const icon = getIcons(STATUS_ICON_TYPE.ACTIVE)!;
    expect(icon?.props.width).toBe('16px');
    expect(icon?.props.height).toBe('16px');
  });
});

describe('sets customized color', () => {
  it('renders ACKNOWLEDGED icon with customized color or stroke', () => {
    const icon = getIcons(STATUS_ICON_TYPE.ACKNOWLEDGED, '#fffff')!;
    expect(icon?.props.fill || icon?.props.stroke).toBe('#fffff');
  });
});

describe('sets icon size', () => {
  it('renders DISABLED icon at the correct size', () => {
    const size = 100;
    const icon = getIcons(STATUS_ICON_TYPE.DISABLED, undefined, size)!;
    expect(icon.props.width).toBe(`${size}px`);
    expect(icon.props.height).toBe(`${size}px`);
  });
});

it('returns normal icon from STATUS_ICON_TYPE.ACKNOWLEDGED provided', () => {
  const iconName = STATUS_ICON_TYPE.ACKNOWLEDGED;
  const icon = getIcons(iconName)!;
  expect(icon.props.stroke).toEqual('#3184c2');
});

it('returns normal icon from STATUS_ICON_TYPE.ACTIVE provided', () => {
  const iconName = STATUS_ICON_TYPE.ACTIVE;
  const icon = getIcons(iconName)!;
  expect(icon.props.fill).toEqual('#d13212');
});

it('returns normal icon from STATUS_ICON_TYPE.ACKNOWLEDGED provided', () => {
  const iconName = STATUS_ICON_TYPE.ACKNOWLEDGED;
  const icon = getIcons(iconName)!;
  expect(icon.props.stroke).toEqual('#3184c2');
});

it('returns normal icon from STATUS_ICON_TYPE.DISABLED provided', () => {
  const iconName = STATUS_ICON_TYPE.DISABLED;
  const icon = getIcons(iconName)!;
  expect(icon.props.stroke).toEqual('#687078');
});

it('returns normal icon from STATUS_ICON_TYPE.LATCHED provided', () => {
  const iconName = STATUS_ICON_TYPE.LATCHED;
  const icon = getIcons(iconName)!;
  expect(icon.props.fill).toEqual('#f89256');
});

it('returns normal icon from STATUS_ICON_TYPE.SNOOZED provided', () => {
  const iconName = STATUS_ICON_TYPE.SNOOZED;
  const icon = getIcons(iconName)!;
  expect(icon.props.stroke).toEqual('#879596');
});

it('returns normal icon from STATUS_ICON_TYPE.SNOOZED provided with color', () => {
  const iconName = STATUS_ICON_TYPE.SNOOZED;
  const icon = getIcons(iconName, 'white')!;
  expect(icon.props.stroke).toEqual('white');
});

it('returns error icon from STATUS_ICON_TYPE.ERROR', () => {
  const iconName = STATUS_ICON_TYPE.ERROR;
  const icon = getIcons(iconName);
  expect(icon).not.toBeNull();
});

it('returned undefined when invalid icon requested', () => {
  expect(getIcons('fake-icon' as StatusIconType)).toBeUndefined();
});
