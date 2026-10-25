import type { Meta, StoryObj } from '@storybook/react';

import DrawdownChart from './DrawdownChart';

const meta = {
  title: 'Dashboard/Drawdown Chart',
  component: DrawdownChart,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof DrawdownChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
