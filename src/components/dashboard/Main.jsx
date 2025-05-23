import { CrimePieChart } from '../CrimePieChart';
import { CrimeTable } from '../CrimeTable';

export default function DashboardPage() {
  return (
    <main className="p-6 space-y-6">
      <CrimePieChart />
      <CrimeTable />
    </main>
  );
}
