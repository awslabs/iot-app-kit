export const IS_MAC_LIKE = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
export const MODIFIER_KEY = IS_MAC_LIKE ? '⌘' : 'Ctrl';
