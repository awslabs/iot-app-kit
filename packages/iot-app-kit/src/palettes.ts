export const MAX_COLORS_SUPPORTED = 6;

export const SEQUENTIAL_BLUES_MUTED = [
  ['#5e87b5'],
  ['#5e87b5', '#b8c6df'],
  ['#5e87b5', '#9cb1d2', '#d4dced'],
  ['#5e87b5', '#88a2c8', '#aebfda', '#d4dced'],
  ['#5e87b5', '#7e9bc3', '#9cb1d2', '#b8c6df', '#d4dced'],
  ['#5e87b5', '#769dd2', '#96b2dd', '#b4c7e9', '#d4dced', '#eff2fb'],
];

export const SEQUENTIAL_QUALITATIVE_MUTED = [
  ['#5e87b5'],
  ['#5e87b5', '#e6ac8c'],
  ['#5e87b5', '#e6ac8c', '#7fc6b1'],
  ['#5e87b5', '#e6ac8c', '#7fc6b1', '#d99090'],
  ['#5e87b5', '#e6ac8c', '#7fc6b1', '#d99090', '#ae779c'],
  ['#5e87b5', '#e6ac8c', '#7fc6b1', '#d99090', '#ae779c', '#f9da95'],
];

export enum PalletScheme {
  BLUE_MUTED = 'blue-MUTED',
  QUALITATIVE_MUTED = 'qualitative-muted',
}

const PALLET_MAP: { [p: string]: string[][] } = {
  [PalletScheme.BLUE_MUTED]: SEQUENTIAL_BLUES_MUTED,
  [PalletScheme.QUALITATIVE_MUTED]: SEQUENTIAL_QUALITATIVE_MUTED,
};

export const getPalette = (pallet: PalletScheme, numColors: number): string[] => {
  const palletSchemes = PALLET_MAP[pallet];
  const colors = palletSchemes[numColors - 1];
  if (colors == null) {
    throw new Error('Cannot add more than 6 data streams');
  }
  return colors;
};
