/* eslint-disable @typescript-eslint/no-explicit-any */
const streamToBuffer = (stream: any) =>
  new Promise((resolve, reject) => {
    const chunks: any[] = [];
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });

export { streamToBuffer };
