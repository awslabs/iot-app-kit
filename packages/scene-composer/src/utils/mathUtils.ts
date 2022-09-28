import * as THREE from 'three';

import { DistanceUnit } from '../interfaces';

/**
 * Format bytes as human-readable text.
 *
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 *
 * @return Formatted string.
 */
export function humanFileSize(bytes: number, si = false, dp = 2) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + ' ' + units[u];
}

const PADDINGS = ['0', '00', '000', '0000', '00000'];
/**
 * Convert javascript integer to the css-style hex string representation.
 * For example: 1193046 => 0x123456 => #123456
 *
 * @param dec decimal color representation
 * @returns css-style hex string of the same color
 */
export function decToHexString(dec: number) {
  const str = dec.toString(16);
  const paddingLen = 6 - str.length;
  if (paddingLen > 0) {
    return '#' + PADDINGS[paddingLen - 1] + str;
  }
  return '#' + str;
}

/**
 * Convert a css-style color string to its decimal form.
 * For example: #123456 => 0x123456 => 1193046
 *
 * If the input is an invalid hex string, the 0xFFFFFF value is returned.
 *
 * @param hex css-style hex string.
 * @returns decimal number of the hex string
 */
export function hexStringToDec(hex: string) {
  // assume hex string is a css-style color string, like #aabbcc
  const result = Number.parseInt(hex.substring(1), 16);
  // return 0xFFFFFF on error;
  return Number.isNaN(result) ? 0xffffff : result;
}

export function parseFloatOrDefault(str: string, defaultValue: number) {
  const result = Number.parseFloat(str);
  if (Number.isNaN(result)) {
    return defaultValue;
  }
  return result;
}

export function generateUUID() {
  return THREE.MathUtils.generateUUID();
}

const DISTANCE_TO_METER_MAP: Record<DistanceUnit, number> = {
  millimeters: 0.001,
  centimeters: 0.01,
  decimeters: 0.1,
  meters: 1,
  kilometers: 1000.0,
  inches: 0.0254,
  feet: 0.3048,
  yards: 0.9144,
  miles: 1609.34,
};

/**
 * Return the scale factor to convert `from` unit to `to` unit.
 */
export function getScaleFactor(from: DistanceUnit, to: DistanceUnit) {
  return DISTANCE_TO_METER_MAP[from] / DISTANCE_TO_METER_MAP[to];
}

export const EPSILON = 1e-6;
/**
 * Return whether 2 numbers approximately equal each other.
 * @param a number
 * @param b number
 * @param epsilon Epsilon value to be used in aprroximation comparison. Default is EPSILON
 * @return true is approximately equal
 */
export function approximatelyEquals(a: number, b: number, epsilon = EPSILON): boolean {
  return Math.abs(Math.max(a, b) - Math.min(a, b)) <= epsilon;
}
