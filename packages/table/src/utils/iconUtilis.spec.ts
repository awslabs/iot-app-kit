import { STATUS_ICONS, StatusIcon } from '@synchro-charts/core';
import { getIcons } from './iconUtils';

describe('sets default pixel size', () => {
  it.each(STATUS_ICONS)('renders %p at correct default size', (iconName) => {
    const icon = getIcons(iconName)!;
    expect(icon?.props.width).toBe('16px');
    expect(icon?.props.height).toBe('16px');
  });
});

describe('sets customized color', () => {
  it.each(STATUS_ICONS)('renders %p with customized color or stroke', (iconName) => {
    const icon = getIcons(iconName, '#fffff')!;
    expect(icon?.props.fill || icon?.props.stroke).toBe('#fffff');
  });
});

describe('sets icon size', () => {
  it.each(STATUS_ICONS)('renders %p at the correct size', (iconName) => {
    const size = 100;
    const icon = getIcons(iconName, undefined, size)!;
    expect(icon.props.width).toBe(`${size}px`);
    expect(icon.props.height).toBe(`${size}px`);
  });
});

it('returns normal icon from StatusIcon.ACKNOWLEDGED provided', () => {
  const iconName = StatusIcon.ACKNOWLEDGED;
  const icon = getIcons(iconName)!;
  expect(icon.props.stroke).toEqual('#3184c2');
});

it('returns normal icon from StatusIcon.ACTIVE provided', () => {
  const iconName = StatusIcon.ACTIVE;
  const icon = getIcons(iconName)!;
  expect(icon.props.fill).toEqual('#d13212');
});

it('returns normal icon from StatusIcon.ACKNOWLEDGED provided', () => {
  const iconName = StatusIcon.ACKNOWLEDGED;
  const icon = getIcons(iconName)!;
  expect(icon.props.stroke).toEqual('#3184c2');
});

it('returns normal icon from StatusIcon.DISABLED provided', () => {
  const iconName = StatusIcon.DISABLED;
  const icon = getIcons(iconName)!;
  expect(icon.props.stroke).toEqual('#687078');
});

it('returns normal icon from StatusIcon.LATCHED provided', () => {
  const iconName = StatusIcon.LATCHED;
  const icon = getIcons(iconName)!;
  expect(icon.props.fill).toEqual('#f89256');
});

it('returns normal icon from StatusIcon.SNOOZED provided', () => {
  const iconName = StatusIcon.SNOOZED;
  const icon = getIcons(iconName)!;
  expect(icon.props.stroke).toEqual('#879596');
});

it('returns normal icon from StatusIcon.SNOOZED provided with color', () => {
  const iconName = StatusIcon.SNOOZED;
  const icon = getIcons(iconName, 'white')!;
  expect(icon.props.stroke).toEqual('white');
});

it('returns error icon from StatusIcon.ERROR', () => {
  const iconName = StatusIcon.ERROR;
  const icon = getIcons(iconName);
  expect(icon).not.toBeNull();
});

it('returned undefined when invalid icon requested', () => {
  expect(getIcons('fake-icon' as StatusIcon)).toBeUndefined();
});
