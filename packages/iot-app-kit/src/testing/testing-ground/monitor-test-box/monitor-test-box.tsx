import { h, Component, Prop } from '@stencil/core';
import { MinimalSizeConfig } from '@synchro-charts/core';

@Component({
  tag: 'monitor-test-box',
  shadow: false,
})
export class MonitorTestBox {
  @Prop() size: MinimalSizeConfig = { width: 0, height: 0 };

  @Prop() someObject?: Object;

  render() {
    const dataProps = this.someObject
      ? Object.keys(this.someObject).reduce(
          (obj, key) => ({
            ...obj,
            [`data-${key}`]: (this.someObject as any)[key],
          }),
          {}
        )
      : {};

    return (
      <div
        {...dataProps}
        class="box-container"
        style={{
          boxSizing: 'border-box',
          border: '1px solid black',
          backgroundColor: 'lightgrey',
          width: `${this.size.width}px`,
          height: `${this.size.height}px`,
        }}
      >
        <ul>
          <li>{this.size.width} width</li>
          <li>{this.size.height} height</li>
        </ul>
      </div>
    );
  }
}
