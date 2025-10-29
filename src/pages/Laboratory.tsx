import { useState } from 'react';
import { FlaskConical, Search, Plus, FileCheck } from 'lucide-react';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';

export function Laboratory() {
  const [searchQuery, setSearchQuery] = useState('');

  const labTests = [
    {
      id: '1',
      testId: 'LAB001',
      patientName: 'John Doe',
      testType: 'Complete Blood Count',
      orderedBy: 'Dr. Sarah Wilson',
      orderedDate: '2024-10-28',
      status: 'PENDING',
    },
    {
      id: '2',
      testId: 'LAB002',
      patientName: 'Jane Smith',
      testType: 'Lipid Profile',
      orderedBy: 'Dr. Michael Chen',
      orderedDate: '2024-10-28',
      status: 'IN_PROGRESS',
    },
    {
      id: '3',
      testId: 'LAB003',
      patientName: 'Bob Johnson',
      testType: 'Thyroid Function Test',
      orderedBy: 'Dr. Emily Brown',
      orderedDate: '2024-10-27',
      status: 'COMPLETED',
    },
    {
      id: '4',
      testId: 'LAB004',
      patientName: 'Alice Williams',
      testType: 'HbA1c',
      orderedBy: 'Dr. David Lee',
      orderedDate: '2024-10-27',
      status: 'COMPLETED',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-700';
      case 'COMPLETED':
        return 'bg-green-100 text-green-700';
      case 'REJECTED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Laboratory</h1>
          <p className="text-gray-600 mt-1">Manage lab tests and results</p>
        </div>
        <Button icon={Plus}>
          Create Lab Order
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Today', value: '32', icon: FlaskConical, color: 'blue' },
          { label: 'Pending', value: '8', icon: FlaskConical, color: 'yellow' },
          { label: 'In Progress', value: '12', icon: FlaskConical, color: 'purple' },
          { label: 'Completed', value: '12', icon: FileCheck, color: 'green' },
        ].map((stat, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Common Lab Tests</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            'Complete Blood Count',
            'Lipid Profile',
            'Liver Function Test',
            'Kidney Function Test',
            'Thyroid Function Test',
            'HbA1c',
            'Blood Glucose',
            'Urinalysis',
          ].map((test, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {test}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search lab tests by ID, patient, or test type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <DataTable
          data={labTests}
          columns={[
            { header: 'Test ID', accessor: 'testId' },
            { header: 'Patient', accessor: 'patientName' },
            { header: 'Test Type', accessor: 'testType' },
            { header: 'Ordered By', accessor: 'orderedBy' },
            { header: 'Date', accessor: 'orderedDate' },
            {
              header: 'Status',
              accessor: (row) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                  {row.status.replace('_', ' ')}
                </span>
              ),
            },
            {
              header: 'Actions',
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  {row.status === 'COMPLETED' ? (
                    <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      View Results
                    </button>
                  ) : (
                    <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      Update Status
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
