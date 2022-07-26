export default function () {
  /**
   * buffer-es6 polyfill checks for TYPED_ARRAY_SUPPORT against the global variable.
   * This is required for that polyfill to perform the correct check.
   */
  window.global = window;
}
