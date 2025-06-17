// import { CrimePieChart } from '../CrimePieChart';
// import { CrimeTable } from '../CrimeTable';
// import { ChartBarDefault } from './charts/CrimeBarChat';
// import StatCard from './StatCards';
// import DownloadButton from './Download';

// export default function DashboardPage() {
//   const stats = [
//     { label: 'Total Reports', value: 124 },
//     { label: 'Pending Reviews', value: 8 },
//     { label: 'Most Reported Crime', value: 'Assault' },
//   ];

//   return (
//     <main className="p-6 space-y-6">
//       <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//           {stats.map((stat) => (
//             <StatCard key={stat.label} label={stat.label} value={stat.value} />
//           ))}
//         </div>
//         <div className="md:mt-0 mt-2">
//           <DownloadButton />
//         </div>
//       </div>
//       <div className="flex flex-col md:flex-row gap-6">
//         <div className="flex-1 bg-white p-4 rounded shadow">
//           <CrimePieChart />
//         </div>
//         <div className="flex-1 bg-white p-4 rounded shadow">
//           <ChartBarDefault />
//         </div>
//       </div>
//       <div className="bg-white p-4 rounded shadow">
//         <CrimeTable />
//       </div>
//     </main>
//   );
//   // (
//   //   <main className="p-6 space-y-6">
//   //     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
//   //       {[
//   //         { label: 'Total Reports', value: 124 },
//   //         { label: 'Pending Reviews', value: 8 },
//   //         { label: 'Blocked Users', value: 3 },
//   //         { label: 'Most Reported Crime', value: 'Assault' },
//   //       ].map((stat) => (
//   //         <div key={stat.label} className="p-4 bg-white rounded shadow">
//   //           <h3 className="text-sm text-gray-500">{stat.label}</h3>
//   //           <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
//   //         </div>
//   //       ))}
//   //     </div>
//   //     <div className="flex gap-3">
//   //       <CrimePieChart />
//   //       <ChartBarDefault />
//   //     </div>
//   //     <CrimeTable />
//   //   </main>
//   // );
// }
import { useEffect, useState } from 'react';
import { CrimePieChart } from '../CrimePieChart';
import { FadeLoader } from 'react-spinners';
import { CrimeTable } from '../CrimeTable';
import { ChartBarDefault } from './charts/CrimeBarChat';
import StatCard from './StatCards';
import DownloadButton from './Download';
import { useCrime } from '@/store/crime';
import useReportsStore from '@/store/reports';

export default function DashboardPage() {
  const {
    fetchReports,
    loading,
    fetchPendingReports,
    totalPendingReports,
    pendingState,
    totalNumOfReports,
  } = useReportsStore();

  const { fetchTopCrimeLocation, topCrimeLocation } = useCrime();
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    const fetchStats = async () => {
      await Promise.all([
        fetchPendingReports(),
        fetchReports({}),
        fetchTopCrimeLocation(),
      ]);
    };
    fetchStats();
  }, [fetchReports, fetchPendingReports, fetchTopCrimeLocation]);

  const stats = [
    {
      label: 'Total Reports',
      value: loading ? <FadeLoader color="#3B82F6" /> : totalNumOfReports,
    },
    {
      label: 'Pending Reviews',
      value: totalPendingReports,
    },
    { label: 'Most Reported Crime', value: 'Assault' },
    { label: 'Highest CrimeRATE AREA', value: topCrimeLocation },
  ];

  return (
    <main className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between items-start gap-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </div>
        <div className="md:mt-0 mt-2">
          <DownloadButton />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 bg-white p-4 rounded shadow">
          <CrimePieChart />
        </div>
        <div className="flex-1 bg-white p-4 rounded shadow">
          <ChartBarDefault />
        </div>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <CrimeTable />
      </div>
    </main>
  );
}
