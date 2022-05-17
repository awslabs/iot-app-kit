export type CustomHTMLElement<T> = T & HTMLElement;

export type Modify<T, R> = Omit<T, keyof R> & R;
