export const Z = {
  Point: 202,
  Text: 201,
  Delete: 201,
  Line: 200,
  Color: 201,
};

export const POSITION = {
  Line: {
    start: 10,
  },
  Text: {
    y: -30,
  },
  Color: {
    x: -77.5,
    y: -10,
  },
  Delete: {
    x: 57,
    y: -28,
  },
  Clip: {
    y: -30,
    height: 30,
  },
};

export const SIZE = {
  Line: {
    width: 2,
    hitbox: 8,
  },
  Color: {
    width: 155,
    height: 5,
  },
  Point: {
    radius: 6,
  },
};

export const STYLE = {
  Text: {
    fill: '#ffffff',
    align: 'center',
    rich: {
      timestamp: {
        width: 130,
        backgroundColor: '#000000',
        height: 16,
        fontSize: 12,
        fontWeight: 'bold',
        align: 'center',
        padding: [2, 20, 2, 5],
      },
    },
  },
};
