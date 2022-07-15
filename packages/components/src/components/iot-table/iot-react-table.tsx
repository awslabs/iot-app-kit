import { Component, Element, Host, Prop, State, h } from '@stencil/core';
import React, { FunctionComponent } from 'react';
import { createRoot, Root } from 'react-dom/client';
import { Table, TableItem, TableProps } from '@iot-app-kit/table';

@Component({
  tag: 'iot-react-table',
})
export class IotReactTable {
  @Prop() items!: TableItem[];

  @Prop() columnDefinitions!: TableProps['columnDefinitions'];

  @Prop() sorting: TableProps['sorting'];

  @Prop() propertyFiltering: TableProps['propertyFiltering'];

  @Element() host: HTMLElement;

  @State() root: Root;

  componentWillLoad() {
    this.root = createRoot(this.host);
  }

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
    this.root.render(React.createElement<TableProps>(Table as FunctionComponent<TableProps>, props));
  }

  render() {
    return <Host />;
  }
}
