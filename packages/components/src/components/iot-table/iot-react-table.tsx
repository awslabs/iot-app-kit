import { Component, Element, Host, Prop, h } from '@stencil/core';
import { Table, TableItem, TableProps, TableMessages } from '@iot-app-kit/table';
import { createRoot } from 'react-dom/client';

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
    const root = createRoot(this.host);

    root.render(<Table {...props} />);
  }

  render() {
    return <Host />;
  }
}
