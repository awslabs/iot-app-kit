import { createStandardUriModifier } from '../../src/utils/uriModifiers';

describe('createStandardUriModifier', () => {
  it('should return a uriModifier that uses the provided baseUrl', () => {
    let sut = createStandardUriModifier('', 's3://anotherbucket/');
    expect(sut('texture.jpg')).toBe('s3://anotherbucket/texture.jpg');

    sut = createStandardUriModifier('s3://bucket/scene.json', '');
    expect(sut('texture.jpg')).toBe('texture.jpg');
  });

  it('should return a uriModifier that uses content url if base url is undefined', () => {
    let sut = createStandardUriModifier('s3://anotherbucket/scene.json', undefined);
    expect(sut('texture.jpg')).toBe('s3://anotherbucket/texture.jpg');

    sut = createStandardUriModifier('', undefined);
    expect(sut('texture.jpg')).toBe('texture.jpg');
  });
});
