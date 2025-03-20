import { type RequestInformationAndRange } from '@iot-app-kit/core';

export const flattenRequestInfoByFetch = ({
  fetchMostRecentBeforeStart,
  fetchMostRecentBeforeEnd,
  fetchFromStartToEnd,
  ...rest
}: RequestInformationAndRange) => {
  const infos: RequestInformationAndRange[] = [];

  if (fetchMostRecentBeforeStart) {
    infos.push({ ...rest, fetchMostRecentBeforeStart });
  }

  if (fetchMostRecentBeforeEnd) {
    infos.push({ ...rest, fetchMostRecentBeforeEnd });
  }

  if (fetchFromStartToEnd) {
    infos.push({ ...rest, fetchFromStartToEnd });
  }

  return infos;
};
