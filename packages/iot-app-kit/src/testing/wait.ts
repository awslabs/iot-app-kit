// Provide a simple way to wait a given period of time
export const wait = (waitMS: number = 100) =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, waitMS);
  });
