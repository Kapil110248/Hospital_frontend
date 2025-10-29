import { useState } from 'react';
import { FileText, Search, Plus, Download } from 'lucide-react';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';

export function Prescriptions() {
  const [searchQuery, setSearchQuery] = useState('');

  const prescriptions = [
    {
      id: '1',
      prescriptionNo: 'RX001',
      patientName: 'John Doe',
      doctorName: 'Dr. Sarah Wilson',
      date: '2024-10-28',
      medications: 'Aspirin 75mg, Lisinopril 10mg',
      status: 'DISPENSED',
    },
    {
      id: '2',
      prescriptionNo: 'RX002',
      patientName: 'Jane Smith',
      doctorName: 'Dr. Michael Chen',
      date: '2024-10-28',
      medications: 'Metformin 500mg, Atorvastatin 20mg',
      status: 'PENDING',
    },
    {
      id: '3',
      prescriptionNo: 'RX003',
      patientName: 'Bob Johnson',
      doctorName: 'Dr. Emily Brown',
      date: '2024-10-27',
      medications: 'Amoxicillin 500mg, Ibuprofen 400mg',
      status: 'DISPENSED',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-700';
      case 'DISPENSED':
        return 'bg-green-100 text-green-700';
      case 'CANCELLED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Prescriptions</h1>
          <p className="text-gray-600 mt-1">Manage patient prescriptions and medications</p>
        </div>
        <Button icon={Plus}>
          Create Prescription
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Today', value: '24', color: 'blue' },
          { label: 'Pending', value: '8', color: 'yellow' },
          { label: 'Dispensed', value: '16', color: 'green' },
        ].map((stat, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <FileText className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search prescriptions by number, patient, or doctor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <DataTable
          data={prescriptions}
          columns={[
            { header: 'Prescription #', accessor: 'prescriptionNo' },
            { header: 'Patient', accessor: 'patientName' },
            { header: 'Doctor', accessor: 'doctorName' },
            { header: 'Date', accessor: 'date' },
            { header: 'Medications', accessor: 'medications' },
            {
              header: 'Status',
              accessor: (row) => (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(row.status)}`}>
                  {row.status}
                </span>
              ),
            },
            {
              header: 'Actions',
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  {row.status === 'PENDING' && (
                    <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      Dispense
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
