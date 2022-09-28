import { shouldCreateImageBitmap } from './TwinMakerTextureLoaderUtils';

describe('shouldCreateImageBitmap', () => {
  let userAgent;

  beforeEach(() => {
    userAgent = 'TestAgent';
    global.createImageBitmap = jest.fn();
  });

  it('should true for valid browser', async () => {
    expect(shouldCreateImageBitmap(userAgent)).toBeTruthy();
  });

  it('should false for some browsers', async () => {
    userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:91.0) Gecko/20100101 Firefox/91.0';
    expect(shouldCreateImageBitmap(userAgent)).toBeFalsy();
  });
});
