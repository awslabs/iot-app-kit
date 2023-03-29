import { Icon, SpaceBetween } from '@cloudscape-design/components';
import Box from '@cloudscape-design/components/box';
import ColumnLayout from "@cloudscape-design/components/column-layout";

const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5'];

export function ResourceList() {
  return (
    <ColumnLayout borders="horizontal">
      {items.map((item) => (
        <SpaceBetween direction="horizontal" size="s">
          <Icon variant="link"
            svg={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" focusable="false" aria-hidden="true">
                <path
                  transform="rotate(45, 8, 8)"
                  d="M9 3 h4 v4 M7 3 H3 v4 M7 13 H3 V9 M9 13 h4 V9 M3 3 l9 9 M13 3 3 13"
                />
              </svg>
          }
          />
          {item}
        </SpaceBetween>
      ))
      }
    </ColumnLayout>
  )
}