import type { Meta, StoryObj } from '@storybook/react';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';

import SortableWidget from './SortableWidget';
import WidgetShell from '../widgets/WidgetShell';

const meta = {
  title: 'Dashboard/Sortable Widget',
  component: SortableWidget,
  tags: ['autodocs'],
  args: {
    id: 'portfolio-performance',
    children: null,
  },
  decorators: [
    (Story) => (
      <DndContext>
        <SortableContext
          items={['portfolio-performance']}
          strategy={rectSortingStrategy}
        >
          <Story />
        </SortableContext>
      </DndContext>
    ),
  ],
  render: (args) => (
    <SortableWidget {...args}>
      <WidgetShell
        title="Portfolio Performance"
        description="Illustrative portfolio growth"
      >
        <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm text-slate-400">
          Drag the handle to reorder this widget
        </div>
      </WidgetShell>
    </SortableWidget>
  ),
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof SortableWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
