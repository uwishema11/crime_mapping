import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { useCrime } from '@/store/crime';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
export const description = 'A bar chart';

const monthOrder = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const chartConfig = {
  desktop: {
    label: 'Crimes',
    color: 'hsl(var(--chart-1))',
  },
};

export function ChartBarDefault() {
  const { fetchGroupedByMonth, loading } = useCrime();
  const [chartData, setChartData] = React.useState([]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchGroupedByMonth();

        console.log(res);
        const formatted = Object.entries(res.data).map(([month, value]) => ({
          month,
          total: value.total,
        }));
        const sorted = formatted.sort(
          (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
        );

        setChartData(sorted);
      } catch (err) {
        console.error('Error loading chart data:', err);
      }
    };
    load();
  }, [fetchGroupedByMonth]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Chart</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            width={500}
            height={300}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barCategoryGap="20%"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar
              dataKey="total"
              fill={chartConfig.desktop.color}
              radius={8}
              barSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total Crimes for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
