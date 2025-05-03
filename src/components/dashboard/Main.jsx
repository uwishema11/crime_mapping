import { CrimePieChart } from "./CrimePieChart";
import { RecentCrimeReports } from "./RecentCrimeReports";
import SectionCards from "./SectionCards";
import { CrimeTrendsChart } from "./CrimeTrendsChart";

export default function DashboardPage() {
  return (
    <main className=" flex flex-col p-6 space-y-6">
      <SectionCards />
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-6">
        <CrimePieChart />
        <CrimeTrendsChart />
      </div>
      <RecentCrimeReports />
    </main>
  );
}
