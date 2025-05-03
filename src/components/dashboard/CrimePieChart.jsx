import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const crimeDataByMonth = {
  January: [
    { category: "Theft", value: 7, fill: "hsl(var(--chart-1))" },
    { category: "Assault", value: 4, fill: "hsl(var(--chart-2))" },
    { category: "Burglary", value: 2, fill: "hsl(var(--chart-3))" },
    { category: "Fraud", value: 4, fill: "hsl(var(--chart-4))" },
    { category: "Other", value: 3, fill: "hsl(var(--chart-5))" },
  ],
  February: [
    { category: "Theft", value: 100, fill: "hsl(var(--chart-1))" },
    { category: "Assault", value: 70, fill: "hsl(var(--chart-2))" },
    { category: "Burglary", value: 50, fill: "hsl(var(--chart-3))" },
    { category: "Fraud", value: 85, fill: "hsl(var(--chart-4))" },
    { category: "Other", value: 40, fill: "hsl(var(--chart-5))" },
  ],
  March: [
    { category: "Theft", value: 100, fill: "hsl(var(--chart-1))" },
    { category: "Assault", value: 70, fill: "hsl(var(--chart-2))" },
    { category: "Burglary", value: 50, fill: "hsl(var(--chart-3))" },
    { category: "Fraud", value: 85, fill: "hsl(var(--chart-4))" },
    { category: "Other", value: 40, fill: "hsl(var(--chart-5))" },
  ],
  April: [
    { category: "Theft", value: 100, fill: "hsl(var(--chart-1))" },
    { category: "Assault", value: 70, fill: "hsl(var(--chart-2))" },
    { category: "Burglary", value: 50, fill: "hsl(var(--chart-3))" },
    { category: "Fraud", value: 85, fill: "hsl(var(--chart-4))" },
    { category: "Other", value: 40, fill: "hsl(var(--chart-5))" },
  ],
  May: [
    { category: "Theft", value: 100, fill: "hsl(var(--chart-1))" },
    { category: "Assault", value: 70, fill: "hsl(var(--chart-2))" },
    { category: "Burglary", value: 50, fill: "hsl(var(--chart-3))" },
    { category: "Fraud", value: 85, fill: "hsl(var(--chart-4))" },
    { category: "Other", value: 40, fill: "hsl(var(--chart-5))" },
  ],
};

const chartConfig = {
  value: {
    label: "Crimes",
  },
  Theft: {
    label: "Theft",
    color: "hsl(var(--chart-1))",
  },
  Assault: {
    label: "Assault",
    color: "hsl(var(--chart-2))",
  },
  Burglary: {
    label: "Burglary",
    color: "hsl(var(--chart-3))",
  },
  Fraud: {
    label: "Fraud",
    color: "hsl(var(--chart-4))",
  },
  Other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
};

export function CrimePieChart() {
  const [activeMonth, setActiveMonth] = React.useState("January");
  const months = React.useMemo(() => Object.keys(crimeDataByMonth), []);

  const totalCrimes = React.useMemo(() => {
    return crimeDataByMonth[activeMonth].reduce(
      (acc, curr) => acc + curr.value,
      0
    );
  }, [activeMonth]);

  return (
    <Card className="flex flex-col w-full max-w-sm h-auto text-gray-700 bg-white rounded-lg border-none">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-base">
          Donut Pie Chart - Monthly Crimes Report
        </CardTitle>
        <CardDescription className="text-sm">
          January - June 2024
        </CardDescription>
        <Select value={activeMonth} onValueChange={setActiveMonth}>
          <SelectTrigger
            className="ml-auto h-6 w-[120px] rounded-lg pl-2 text-xs"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {months.map((key) => (
              <SelectItem
                key={key}
                value={key}
                className="rounded-lg [&_span]:flex"
              >
                <div className="flex items-center gap-2 text-xs">
                  <span
                    className="flex h-3 w-3 shrink-0 rounded-sm"
                    style={{
                      backgroundColor: `var(--color-${key})`,
                    }}
                  />
                  {key}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[200px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={crimeDataByMonth[activeMonth]}
              dataKey="value"
              nameKey="category"
              innerRadius={50}
              strokeWidth={4}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalCrimes.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 20}
                          className="fill-muted-foreground text-sm"
                        >
                          Total Crimes
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-1 text-xs">
        <div className="flex items-center gap-1 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-3 w-3" />{" "}
        </div>
        <div className="leading-none text-muted-foreground">
          Showing crime data for the last 6 months
        </div>
      </CardFooter>
    </Card>
  );
}
