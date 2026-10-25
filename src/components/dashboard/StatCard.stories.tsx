import type { Meta, StoryObj } from '@storybook/react';
import { Activity } from 'lucide-react';

import StatCard from './StatCard';

const meta = {
  title: 'Dashboard/Stat Card',
  component: StatCard,
  tags: ['autodocs'],
  args: {
    title: 'Total Portfolio Value',
    value: '$2,450,680',
    change: '+12.8%',
    trend: 'up',
    description: 'vs. previous period',
    icon: Activity,
  },
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Positive: Story = {};

export const Negative: Story = {
  args: {
    title: 'Maximum Drawdown',
    value: '-6.32%',
    change: '-1.2%',
    trend: 'down',
    description: 'vs. previous period',
  },
};

export const WithoutChange: Story = {
  args: {
    title: 'Net Asset Value',
    value: '$1,845,230',
    change: undefined,
    trend: 'neutral',
    description: 'Current portfolio NAV',
  },
};
