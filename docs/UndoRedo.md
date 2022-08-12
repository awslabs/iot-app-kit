# Undo/Redo

The undo/redo functionality allows the user to revert changes made while editing the dashboard. 

## Properties

### `State`

The dashboard state stores all necessary information to render dashboard. 

Type: Object

A state contains the following fields:

 - `dashboardConfiguration`

    Holds the array of widgets as well as viewport information.

    Type: DashboardConfiguration

 - `selectedWidgetIds`

    The ids of the widgets selected.

    Type: string[]     

 - `numTimesCopyGroupHasBeenPasted`

    The number of times the copy group has been pasted. 

    Type: number

- `copyGroup`

    The group of widgets that have been copied. 

    Type: Widget[]

- `stretchToFit`

    Holds whether or not the dashboard should be in stretch to fit mode. 

    Type: boolean

- `width`

    The width in pixels of dashboard. 

    Type: number

- `cell size`

    The cell size in pixels of dashboard. 

    Type: number

- `intermediateDashboardConfiguration`

    The dashboard configuration while an action is taking place, such as a widget being moved or resized. 

    Type: DashboardConfiguration

- `undoQueue`

    Queue that holds all previous actions perfomed.

    Type: DashboardAction[]

- `redoQueue`

    Queue that holds all previous actions undone.

    Type: DashboardAction[]

- `previousPosition`

    The position used in move as reference for where move started.     

    Type: Position

#### Example
```
const state: DashboardState = {
    dashboardConfiguration: dashboardConfig,
    selectedWidgetIds: [],
    numTimesCopyGroupHasBeenPasted: 0,
    copyGroup: [],
    stretchToFit: DEFAULT_STRETCH_TO_FIT,
    width: DEFAULT_WIDTH,
    cellSize: DEFAULT_CELL_SIZE,
    intermediateDashboardConfiguration: undefined,
    undoQueue: [],
    redoQueue: [],
    previousPosition: undefined,
  };
```

### `Actions`

A dashboard action is any change made to the dashboard that would result in the state changing. 

An action has the following fields:
- `type`

    Specifies type of action (move, resize, etc.)    

    Type: String

- `payload`

    Necessary information to perform action that is not available in the state.     

#### Example
```
export interface MoveAction extends Action<DashboardActionType.MOVE> {
  type: typeof DashboardActionType.MOVE;
  payload: {
    position: Position;
    widgetIds: string[];
    isActionComplete: boolean;
  };
}
```

### `Reducer Function`

The reducer function manages the state of the dashboard by accepting the current state of the dashboard and a dashboard action as parameters, and returns the resulting state. 

### `Reversal of Actions`

To undo an action, the action must be reversed and then performed. The process of reversal must be defined for each individual action. 

#### Example
```
export const reverseMove = (moveAction: MoveAction): MoveAction => {
  if (typeof moveAction.payload.prevPosition != 'undefined') {
    return {
      ...moveAction,
      payload: {
        position: moveAction.payload.prevPosition,
        prevPosition: moveAction.payload.position,
        isActionComplete: moveAction.payload.isActionComplete,
      },
    };
  }
  return moveAction;
};
```
### `Undo Function`
The undo function works similarly to the reducer, but it first reverses the action, then performs the reversed action.

```
 case 'MOVE':
      return {
        ...(dashboardAction = reverseMove(dashboardAction)),
        ...dashboardState,
        dashboardConfiguration: move({
          dashboardConfiguration: dashboardState.dashboardConfiguration,
          cellSize: dashboardState.cellSize,
          position: dashboardAction.payload.position,
          previousPosition: dashboardAction.payload.prevPosition,
          selectedWidgetIds: dashboardAction.payload.widgetIds || dashboardState.selectedWidgetIds,
        }),
      };

```

### `Redo Function`
The redo function works just like the reducer, it takes an action and simply performs it.

```
 case 'MOVE':
      return {
        ...dashboardState,
        dashboardConfiguration: move({
          dashboardConfiguration: dashboardState.dashboardConfiguration,
          cellSize: dashboardState.cellSize,
          position: dashboardAction.payload.position,
          previousPosition: dashboardAction.payload.prevPosition,
          selectedWidgetIds: dashboardAction.payload.widgetIds || dashboardState.selectedWidgetIds,
        }),
      };

```