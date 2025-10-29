import { Shield, FileText, AlertTriangle, CheckCircle, TrendingUp, Activity } from 'lucide-react';
import { StatsCard } from '../../components/common/StatsCard';
import { Button } from '../../components/common/Button';
import { DataTable } from '../../components/common/DataTable';

export function AuditorDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Audit Dashboard</h1>
          <p className="text-gray-600 mt-1">Compliance monitoring and system audits</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" icon={FileText}>Export Report</Button>
          <Button variant="primary" icon={Shield}>New Audit</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Compliance Score"
          value="94%"
          icon={CheckCircle}
          color="green"
          trend={{ value: '+2%', isPositive: true }}
        />
        <StatsCard
          title="Active Alerts"
          value="12"
          icon={AlertTriangle}
          color="orange"
        />
        <StatsCard
          title="Audits This Month"
          value="28"
          icon={FileText}
          color="purple"
        />
        <StatsCard
          title="System Activity"
          value="High"
          icon={Activity}
          color="teal"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Compliance Metrics</h2>
            <div className="space-y-4">
              {[
                { category: 'Data Security', score: 98, status: 'excellent', color: 'bg-success-500' },
                { category: 'Patient Privacy (HIPAA)', score: 95, status: 'excellent', color: 'bg-success-500' },
                { category: 'Access Control', score: 92, status: 'good', color: 'bg-blue-500' },
                { category: 'Audit Trails', score: 88, status: 'good', color: 'bg-blue-500' },
                { category: 'Document Management', score: 85, status: 'fair', color: 'bg-warning-500' },
              ].map((metric, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{metric.category}</span>
                    <span className="font-bold text-gray-900">{metric.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${metric.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${metric.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Audit Logs</h2>
            <DataTable
              data={[]}
              columns={[
                { header: 'Timestamp', accessor: 'timestamp' },
                { header: 'User', accessor: 'user' },
                { header: 'Action', accessor: 'action' },
                { header: 'Module', accessor: 'module' },
                { header: 'Status', accessor: 'status' },
              ]}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Active Alerts</h2>
            <div className="space-y-3">
              {[
                { type: 'Failed Login', count: 5, severity: 'medium', color: 'bg-warning-50 border-warning-500' },
                { type: 'Unauthorized Access', count: 2, severity: 'high', color: 'bg-error-50 border-error-500' },
                { type: 'Data Export', count: 3, severity: 'low', color: 'bg-blue-50 border-blue-500' },
                { type: 'Permission Change', count: 2, severity: 'medium', color: 'bg-warning-50 border-warning-500' },
              ].map((alert, i) => (
                <div key={i} className={`p-3 rounded-lg border-2 ${alert.color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{alert.type}</p>
                      <p className="text-sm text-gray-600">{alert.count} incidents</p>
                    </div>
                    <AlertTriangle className={`w-5 h-5 ${
                      alert.severity === 'high' ? 'text-error-600' :
                      alert.severity === 'medium' ? 'text-warning-600' :
                      'text-blue-600'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">User Activity</h2>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2">
                <span className="text-sm text-gray-700">Active Users</span>
                <span className="text-sm font-bold text-success-600">124</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span className="text-sm text-gray-700">Sessions Today</span>
                <span className="text-sm font-bold text-gray-900">456</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span className="text-sm text-gray-700">Failed Logins</span>
                <span className="text-sm font-bold text-error-600">8</span>
              </div>
              <div className="flex items-center justify-between p-2">
                <span className="text-sm text-gray-700">Avg Session Time</span>
                <span className="text-sm font-bold text-gray-900">2.5 hrs</span>
              </div>
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" icon={FileText}>
                Generate Audit Report
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={Activity}>
                View System Logs
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={Shield}>
                Security Settings
              </Button>
              <Button variant="outline" className="w-full justify-start" icon={AlertTriangle}>
                Alert Configuration
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Data Access by Module</h2>
          <div className="space-y-3">
            {[
              { module: 'Patient Records', accesses: 1245, trend: '+12%' },
              { module: 'Billing', accesses: 856, trend: '+8%' },
              { module: 'Pharmacy', accesses: 642, trend: '+15%' },
              { module: 'Laboratory', accesses: 534, trend: '+5%' },
              { module: 'Administration', accesses: 423, trend: '+3%' },
            ].map((mod, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{mod.module}</p>
                  <p className="text-sm text-gray-600">{mod.accesses} accesses today</p>
                </div>
                <span className="text-sm font-bold text-success-600">{mod.trend}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Compliance Issues</h2>
          <div className="space-y-3">
            {[
              { issue: 'Password expiry pending', count: 12, priority: 'medium' },
              { issue: 'Incomplete audit trails', count: 3, priority: 'high' },
              { issue: 'Access review overdue', count: 8, priority: 'medium' },
              { issue: 'Training certificates expired', count: 5, priority: 'low' },
            ].map((issue, i) => (
              <div key={i} className={`p-3 rounded-lg ${
                issue.priority === 'high' ? 'bg-error-50' :
                issue.priority === 'medium' ? 'bg-warning-50' :
                'bg-blue-50'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{issue.issue}</p>
                    <p className="text-sm text-gray-600">{issue.count} items</p>
                  </div>
                  <Button size="sm" variant="outline">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
