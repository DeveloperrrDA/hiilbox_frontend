'use client'

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A linear area chart'

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 305 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 73 },
  { month: 'May', desktop: 209 },
  { month: 'June', desktop: 214 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig
import { Card } from '@/components/ui/card'

const ChartAreaLinear = () => {
  return (
      <div>
        <div className='p-6'>
          <div>
        <ChartContainer config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator='dot' hideLabel />}
            />
            <Area
              dataKey='desktop'
              type='linear'
              fill='var(--color-secondary)'
              fillOpacity={0.4}
              stroke='var(--color-secondary)'
            />
          </AreaChart>
        </ChartContainer>
      </div>
        </div>
      </div>
  )
}

export default ChartAreaLinear
