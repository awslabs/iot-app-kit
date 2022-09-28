import path from 'path';

import isAbsoluteUrl from 'is-absolute-url';

export function extractFileNameExtFromUrl(fileUrl: string) {
  let urlPath = fileUrl;
  if (isAbsoluteUrl(fileUrl)) {
    const u = new URL(fileUrl);
    urlPath = u.pathname;
  } else {
    // Note, if the url is relative, for this function, we don't really care
    // about the baseUrl, so instead of reimplementing the URL parsing logic,
    // we'll supply an arbitrary baseUrl to make the URL class working.
    const u = new URL(fileUrl, 'file://');
    urlPath = u.pathname;
  }

  const extension = path.extname(urlPath);
  const basename = path.basename(urlPath, extension);

  // remove '.' from the extension
  const ext = extension.startsWith('.') ? extension.substring(1) : extension;

  return [decodeURI(basename), decodeURI(ext)];
}

// Expecting arn:aws:s3:::<bucket_name>
export function parseS3BucketFromArn(s3Arn: string): string {
  const arnSplit = s3Arn.split('arn:aws:s3:::');
  return arnSplit[1];
}

export function getContainingDir(uri: string): string {
  if (uri.length === 0) return uri;

  if (uri.endsWith('/')) return uri;

  const dirname = path.dirname(uri);

  // avoid returning './' which is equivalent to ''
  return dirname === '.' ? '' : dirname + '/';
}

export function combineUrls(baseUrl: string, relativeUrl: string) {
  return relativeUrl ? baseUrl.replace(/\/+$/, '') + '/' + relativeUrl.replace(/^\/+/, '') : baseUrl;
}
