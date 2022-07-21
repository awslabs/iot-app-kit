import { Component, Element, Host, Prop, h } from '@stencil/core';
import React, { FunctionComponent } from 'react';
import { Table, TableItem, TableProps } from '@iot-app-kit/table';
import ReactDOM from 'react-dom';

@Component({
  tag: 'iot-react-table',
})
export class IotReactTable {
  @Prop() items!: TableItem[];

  @Prop() columnDefinitions!: TableProps['columnDefinitions'];

  @Prop() sorting: TableProps['sorting'];

  @Prop() propertyFiltering: TableProps['propertyFiltering'];

  @Element() host: HTMLElement;

  componentWillLoad() {}

  componentDidLoad() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const props: TableProps = {
      items: this.items,
      columnDefinitions: this.columnDefinitions,
      sorting: this.sorting,
      propertyFiltering: this.propertyFiltering,
    };
    ReactDOM.render(React.createElement<TableProps>(Table as FunctionComponent<TableProps>, props), this.host);
  }

  render() {
    return <Host />;
  }
}
