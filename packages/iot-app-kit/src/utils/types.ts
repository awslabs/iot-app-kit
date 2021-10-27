export type CustomHTMLElement<T> = T & HTMLElement;

export interface Size {
  width: number;
  height: number;
}

export interface StencilCSSProperty {
  [key: string]: string | undefined;
}

// The position and dimensions of a rectangle, not taking into account of the scrolled position of the page.
// i.e. the position of a rect does *not* change upon scrolling.
// a `Rect` should only be used in the context of rendering to the webGL canvas.
// The behavior of not moving on scroll allows for us to instead take account of the scroll
// positioning within the render loop of webGL. This allows us to not have to update `Rects` at every 16ms during
// scroll events.
export type RectScrollFixed = Omit<DOMRect, 'toJSON'> & { density: number };
