export function shouldCreateImageBitmap(userAgent: string) {
  // Use an ImageBitmapLoader if imageBitmaps are supported. Moves much of the
  // expensive work of uploading a texture to the GPU off the main thread.
  //
  // The following line is copied from Three.js which excludes Firefox by userAgent.
  //   https://developer.mozilla.org/en-US/docs/Web/API/createImageBitmap
  //   https://caniuse.com/?search=createImageBitmap
  return typeof createImageBitmap !== 'undefined' && /Firefox|^((?!chrome|android).)*safari/i.test(userAgent) === false;
}
