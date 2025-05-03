import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function AnalyticsCard({ title, value }) {
  return (
    <Card className=" py-4 px-5 bg-white rounded-lg shadow p-4 mb-4 border-none">
      <CardHeader className="space-y-1">
        <CardDescription>{title}</CardDescription>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-semibold tabular-nums">
            {value}
          </CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
}
