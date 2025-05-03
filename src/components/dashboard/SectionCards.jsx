import React from "react";
import { AnalyticsCard } from "./StatiscticalCard";

export default function SectionCards() {
  return (
    <div className="text-blue flex flex-col gap-4 px-5 lg:flex-row lg:flex-wrap lg:justify-between lg:px-6">
      <div className="w-full lg:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
        <AnalyticsCard title="Crime Categories" value={7} />
      </div>
      <div className="w-full md:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
        <AnalyticsCard title="All Crimes" value={20} />
      </div>
      <div className="w-full lg:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
        <AnalyticsCard title="All Users" value={78} />
      </div>
      <div className="w-full md:w-[calc(50%-0.5rem)] xl:w-[calc(25%-0.75rem)]">
        <AnalyticsCard title="Active users" value={54} />
      </div>
    </div>
  );
}
