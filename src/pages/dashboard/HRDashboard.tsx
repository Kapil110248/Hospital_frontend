import { Users, UserPlus, Calendar, DollarSign, Clock, Award } from 'lucide-react';
import { StatsCard } from '../../components/common/StatsCard';
import { Button } from '../../components/common/Button';
import { DataTable } from '../../components/common/DataTable';

export function HRDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Human Resources</h1>
          <p className="text-gray-600 mt-1">Staff management and payroll</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={Calendar}>Manage Shifts</Button>
          <Button variant="primary" icon={UserPlus}>Add Employee</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Staff"
          value="156"
          icon={Users}
          color="purple"
          trend={{ value: '+3 this month', isPositive: true }}
        />
        <StatsCard
          title="On Duty Today"
          value="124"
          icon={Clock}
          color="teal"
        />
        <StatsCard
          title="On Leave"
          value="8"
          icon={Calendar}
          color="orange"
        />
        <StatsCard
          title="Payroll (MTD)"
          value="$245K"
          icon={DollarSign}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Staff by Department</h2>
            <div className="space-y-3">
              {[
                { dept: 'Doctors', count: 42, color: 'bg-hospital-purple' },
                { dept: 'Nurses', count: 68, color: 'bg-teal-500' },
                { dept: 'Administration', count: 18, color: 'bg-blue-500' },
                { dept: 'Support Staff', count: 28, color: 'bg-orange-500' },
              ].map((dept, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{dept.dept}</span>
                      <span className="font-bold text-gray-900">{dept.count}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`${dept.color} h-3 rounded-full`}
                        style={{ width: `${(dept.count / 156) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Hires</h2>
            <DataTable
              data={[]}
              columns={[
                { header: 'Name', accessor: 'name' },
                { header: 'Position', accessor: 'position' },
                { header: 'Department', accessor: 'department' },
                { header: 'Join Date', accessor: 'joinDate' },
                { header: 'Status', accessor: 'status' },
              ]}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Leave Requests</h2>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="font-medium text-gray-900">Dr. John Smith</p>
                  <p className="text-sm text-gray-600">Leave: Dec 25-27, 2024</p>
                  <p className="text-sm text-gray-600">Reason: Personal</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="success" className="flex-1">Approve</Button>
                    <Button size="sm" variant="danger" className="flex-1">Reject</Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" icon={Users}>
                View All Staff
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={Calendar}>
                Shift Management
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={DollarSign}>
                Process Payroll
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={Award}>
                Performance Reviews
              </Button>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance Today</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2">
                <span className="text-sm text-gray-700">Present</span>
                <span className="text-sm font-bold text-success-600">124</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span className="text-sm text-gray-700">On Leave</span>
                <span className="text-sm font-bold text-warning-600">8</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span className="text-sm text-gray-700">Absent</span>
                <span className="text-sm font-bold text-error-600">2</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span className="text-sm text-gray-700">Late</span>
                <span className="text-sm font-bold text-orange-600">5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Upcoming Birthdays</h2>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Dr. Jane Doe</p>
                  <p className="text-sm text-gray-600">December {20 + i}, 2024</p>
                </div>
                <span className="text-2xl">🎂</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Training Programs</h2>
          <div className="space-y-2">
            {[
              { title: 'Emergency Response', date: 'Jan 15, 2025', enrolled: 24 },
              { title: 'Patient Communication', date: 'Jan 20, 2025', enrolled: 18 },
              { title: 'Medical Equipment', date: 'Jan 25, 2025', enrolled: 12 },
            ].map((program, i) => (
              <div key={i} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{program.title}</p>
                    <p className="text-sm text-gray-600">{program.date}</p>
                  </div>
                  <span className="text-sm font-bold text-hospital-purple">{program.enrolled} enrolled</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
