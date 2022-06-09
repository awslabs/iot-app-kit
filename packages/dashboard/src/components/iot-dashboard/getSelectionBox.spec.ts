import { getSelectionBox } from './getSelectionBox';

it('returns no rectangle if no widgets on the dashboard', () => {
  expect(
    getSelectionBox({
      selectedWidgetIds: ['fake'],
      dashboardConfiguration: [],
    })
  ).toBe(null);
});

it('returns no rectangle if no widgets are selected', () => {
  expect(
    getSelectionBox({
      selectedWidgetIds: [],
      dashboardConfiguration: [
        {
          widget: 'fake',
          id: 'some-widget',
          x: 0,
          y: 0,
          height: 10,
          width: 10,
        },
      ],
    })
  ).toBe(null);
});

it('returns exact dimensions of selected widget if only one widget is selected', () => {
  expect(
    getSelectionBox({
      selectedWidgetIds: ['some-widget'],
      dashboardConfiguration: [
        {
          widget: 'fake',
          id: 'some-widget',
          x: 0,
          y: 0,
          height: 10,
          width: 10,
        },
      ],
    })
  ).toEqual({
    x: 0,
    y: 0,
    width: 10,
    height: 10,
  });
});

it('returns rectangle that contains multiple rectangles', () => {
  expect(
    getSelectionBox({
      selectedWidgetIds: ['some-widget', 'some-widget-2'],
      dashboardConfiguration: [
        {
          widget: 'fake',
          id: 'some-widget',
          x: 0,
          y: 0,
          height: 10,
          width: 10,
        },
        {
          widget: 'fake',
          id: 'some-widget-2',
          x: 100,
          y: 100,
          height: 10,
          width: 10,
        },
      ],
    })
  ).toEqual({
    x: 0,
    y: 0,
    width: 110,
    height: 110,
  });
});
