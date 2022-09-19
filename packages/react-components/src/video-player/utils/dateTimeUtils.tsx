// Format Date object to get date and time to display on the video player
export const getFormattedDateTime = (rawDate: Date) => {
  const date = rawDate.getMonth() + 1 + '/' + rawDate.getDate();
  const time = rawDate.toTimeString().split(' ')[0];
  const dateTime = date + '\n' + time;
  return dateTime;
};

// Get the new seek time
export const getNewSeekTime = (newXPosition: number, rect: DOMRect, startTime: number, endTime: number) => {
  let seekTime = 0;
  if (rect) {
    const { x, width } = rect;
    const newPositionPercentage = (newXPosition - x) / width;
    seekTime = startTime + newPositionPercentage * (endTime - startTime);
  }
  return seekTime;
};
