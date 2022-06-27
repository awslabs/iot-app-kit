import { Component, h, Listen, State, Prop } from '@stencil/core';
import { createStore } from 'redux';
import { DashboardStore, OnResize, Widgets, MoveActionInput } from '../../types';
import { dashboardReducer } from '../../dashboard-actions/dashboardReducer';
import { onMoveAction, MoveAction } from '../../dashboard-actions/actions';

const DEFAULT_STRETCH_TO_FIT = true;
const DEFAULT_CELL_SIZE = 15;

@Component({
  tag: 'iot-dashboard-wrapper',
  shadow: false,
})
export class IotDashboardWrapper {
  /** The configurations which determines which widgets render where with what settings. */
  @Prop() dashboardConfiguration: Widgets;
  /**
   * Callback that is fired every time the dashboard configuration has been altered.
   *
   * When a widget is moved, resized, deleted, appended, or altered, then this method is called
   */
  @Prop() onDashboardConfigurationChange: (config: Widgets) => void;

  /**
   * Whether the dashboard grid will stretch to fit.
   */
  @Prop() stretchToFit: Boolean = DEFAULT_STRETCH_TO_FIT;

  /** Width of the dashboard, in pixels */
  @Prop() width: number;

  /** Width and height of the cell, in pixels */
  @Prop() cellSize: number = DEFAULT_CELL_SIZE;

  @State() dashboardLayout: Widgets;

  @Listen('testEvent')
  testEvent(event: CustomEvent) {
    console.log('recieved move event', );
    
  }

  @Listen('mousedown')
  onMouseDown(event: MouseEvent) {
    
    console.log("mousedown from wrapper");
  }

  @Listen('moveEvent')
  moveEvent(event: CustomEvent<MoveActionInput>) {
      this.move(event.detail);
  }

  
  
 

  store: DashboardStore;
  componentWillLoad() {
    this.store = createStore(dashboardReducer, this.dashboardConfiguration);
    this.store.subscribe(() => {
      this.dashboardLayout = this.store.getState();
    });
  }
  

  move(moveInput: MoveActionInput) {
    this.store.dispatch(onMoveAction(moveInput));
  }


  render() {
    return (
      <div>
        <iot-dashboard
          dashboardConfiguration = {this.dashboardLayout}
          onDashboardConfigurationChange={this.onDashboardConfigurationChange}
          stretchToFit={this.stretchToFit}
          width={this.width}
          cellSize={this.cellSize}
        ></iot-dashboard>
      
      
        
      
      </div>
      
      
    );
  }
}
