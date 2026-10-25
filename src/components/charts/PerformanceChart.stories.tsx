import type { Meta, StoryObj } from '@storybook/react';

import PerformanceChart from './PerformanceChart';

const sampleData = [
  { date: 'Sep 16', value: 2180000, benchmark: 2000000 },
  { date: 'Sep 20', value: 2210000, benchmark: 2020000 },
  { date: 'Sep 24', value: 2195000, benchmark: 2015000 },
  { date: 'Sep 28', value: 2260000, benchmark: 2050000 },
  { date: 'Oct 02', value: 2290000, benchmark: 2070000 },
  { date: 'Oct 06', value: 2315000, benchmark: 2090000 },
  { date: 'Oct 10', value: 2380000, benchmark: 2120000 },
  { date: 'Oct 16', value: 2450680, benchmark: 2150000 },
];

const meta = {
  title: 'Dashboard/Performance Chart',
  component: PerformanceChart,
  tags: ['autodocs'],
  args: {
    data: sampleData,
    height: 280,
    currency: '$',
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof PerformanceChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PortfolioAndBenchmark: Story = {};

export const PortfolioOnly: Story = {
  args: {
    data: sampleData.map(({ date, value }) => ({ date, value })),
    currency: '€',
  },
};

export const EmptyState: Story = {
  args: {
    data: [],
  },
};
