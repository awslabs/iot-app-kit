/**
 * navigator.platform is deprecated see - https://developer.mozilla.org/en-US/docs/Web/API/Navigator/platform
 * For usecases like displaying the proper key for copy / paste shortcuts, documentation suggets this is fine.
 *  */
export const isMacLike = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
