// from: https://github.com/mswjs/jest-fixed-jsdom
// importing this as a package wasn't working due to ES Module errors

// eslint-disable-next-line
const JSDOMEnvironment = require('jest-environment-jsdom').default;

class FixedJSDOMEnvironment extends JSDOMEnvironment {
  constructor(...args) {
    super(...args);

    this.global.TextDecoder = TextDecoder;
    this.global.TextEncoder = TextEncoder;
    this.global.TextDecoderStream = TextDecoderStream;
    this.global.TextEncoderStream = TextEncoderStream;
    this.global.ReadableStream = ReadableStream;

    this.global.Blob = Blob;
    this.global.Headers = Headers;
    this.global.FormData = FormData;
    this.global.Request = Request;
    this.global.Response = Response;
    this.global.fetch = fetch;
    this.global.structuredClone = structuredClone;
    this.global.URL = URL;
    this.global.URLSearchParams = URLSearchParams;

    this.global.BroadcastChannel = BroadcastChannel;
    this.global.TransformStream = TransformStream;
  }
}

module.exports = FixedJSDOMEnvironment;
