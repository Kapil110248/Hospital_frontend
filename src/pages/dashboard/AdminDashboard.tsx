import { Users, UserCheck, DollarSign, Calendar, AlertCircle, TrendingUp } from 'lucide-react';
import { StatsCard } from '../../components/common/StatsCard';
import { DataTable } from '../../components/common/DataTable';
import { Appointment } from '../../types';

export function AdminDashboard() {
  const recentAppointments: Appointment[] = [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of hospital operations and metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Patients"
          value="1,234"
          icon={Users}
          color="purple"
          trend={{ value: '+12%', isPositive: true }}
        />
        <StatsCard
          title="Total Staff"
          value="156"
          icon={UserCheck}
          color="teal"
          trend={{ value: '+3', isPositive: true }}
        />
        <StatsCard
          title="Revenue (Today)"
          value="$12,450"
          icon={DollarSign}
          color="green"
          trend={{ value: '+18%', isPositive: true }}
        />
        <StatsCard
          title="Appointments"
          value="48"
          icon={Calendar}
          color="blue"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pending Payments</h2>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-warning-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Patient #{1000 + i}</p>
                  <p className="text-sm text-gray-600">Invoice #INV-{2024000 + i}</p>
                </div>
                <span className="font-bold text-warning-600">${(Math.random() * 1000 + 500).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Department Performance</h2>
          <div className="space-y-3">
            {['Cardiology', 'Neurology', 'Orthopedics'].map((dept, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-success-600" />
                  <span className="font-medium text-gray-900">{dept}</span>
                </div>
                <span className="font-bold text-gray-900">{85 + i * 3}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
        <DataTable
          data={recentAppointments}
          columns={[
            { header: 'Token', accessor: 'tokenNumber' },
            { header: 'Patient', accessor: (row) => `${row.patient?.firstName} ${row.patient?.lastName}` },
            { header: 'Doctor', accessor: (row) => `Dr. ${row.doctor?.firstName} ${row.doctor?.lastName}` },
            { header: 'Time', accessor: 'scheduledAt' },
            {
              header: 'Status',
              accessor: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  row.status === 'COMPLETED' ? 'bg-success-100 text-success-700' :
                  row.status === 'IN_CONSULTATION' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {row.status}
                </span>
              ),
            },
          ]}
        />
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-warning-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-warning-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">System Alerts</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 3 medicines below reorder level</li>
              <li>• 2 pending lab results from yesterday</li>
              <li>• Database backup scheduled for tonight</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
