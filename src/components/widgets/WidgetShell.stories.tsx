import type { Meta, StoryObj } from '@storybook/react';

import WidgetShell from './WidgetShell';

const meta = {
  title: 'Dashboard/Widget Shell',
  component: WidgetShell,
  tags: ['autodocs'],
  args: {
    title: 'Portfolio Overview',
    description: 'Key portfolio information',
    children: (
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm text-slate-400">Portfolio value</p>
          <p className="mt-2 text-2xl font-semibold text-white">$2.45M</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-sm text-slate-400">Monthly return</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-400">+4.8%</p>
        </div>
      </div>
    ),
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof WidgetShell>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithAction: Story = {
  args: {
    action: (
      <span className="rounded-lg bg-emerald-500/10 px-3 py-1.5 text-sm text-emerald-400">
        +12.8%
      </span>
    ),
  },
};
