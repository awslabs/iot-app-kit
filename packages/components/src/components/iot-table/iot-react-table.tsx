import { Component, Element, Host, Prop, h } from '@stencil/core';
import React, { FunctionComponent } from 'react';
import { Table, TableItem, TableProps, TableMessages } from '@iot-app-kit/table';
import ReactDOM from 'react-dom';

@Component({
  tag: 'iot-react-table',
})
export class IotReactTable {
  @Prop() items!: TableItem[];

  @Prop() columnDefinitions!: TableProps['columnDefinitions'];

  @Prop() sorting: TableProps['sorting'];

  @Prop() propertyFiltering: TableProps['propertyFiltering'];

  @Prop() messageOverrides: TableMessages;

  @Element() host: HTMLElement;

  componentDidLoad() {
    this.componentDidUpdate();
  }

  componentDidUpdate() {
    const props: TableProps = {
      items: this.items,
      columnDefinitions: this.columnDefinitions,
      sorting: this.sorting,
      propertyFiltering: this.propertyFiltering,
      messageOverrides: this.messageOverrides,
    };
    ReactDOM.render(React.createElement<TableProps>(Table as FunctionComponent<TableProps>, props), this.host);
  }

  render() {
    return <Host />;
  }
}
