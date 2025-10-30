
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { JSX } from "react";

const chartConfig = {
    desktop: {
        label: "Desktop",
        color: "var(--chart-2)",
    },
} satisfies ChartConfig;

type DottedLineChartProps = {
    chartData: {
        month: string;
        value: number;
    }[]
}

export function DottedLineChart({ chartData }: DottedLineChartProps) : JSX.Element{
    return (
        <Card>
            <CardHeader>
                <CardTitle>
                    Number of meetings Attended
                    <Badge
                        variant="outline"
                        className="text-green-500 bg-green-500/10 border-none ml-2"
                    >
                        <TrendingUp className="h-4 w-4" />
                        <span>5.2%</span>
                    </Badge>
                </CardTitle>
                <CardDescription>January - June 2024</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="value"
                            type="linear"
                            stroke="var(--color-desktop)"
                            dot={false}
                            strokeDasharray="4 4"
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}