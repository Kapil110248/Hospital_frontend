import { useState } from 'react';
import { DollarSign, Search, Plus, Download } from 'lucide-react';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';

export function Billing() {
  const [searchQuery, setSearchQuery] = useState('');

  const invoices = [
    {
      id: '1',
      invoiceNo: 'INV-001',
      patientName: 'John Doe',
      services: 'Consultation, Lab Tests',
      amount: 1250.00,
      paid: 1250.00,
      balance: 0,
      date: '2024-10-28',
      status: 'PAID',
    },
    {
      id: '2',
      invoiceNo: 'INV-002',
      patientName: 'Jane Smith',
      services: 'MRI Scan, Consultation',
      amount: 3500.00,
      paid: 1500.00,
      balance: 2000.00,
      date: '2024-10-28',
      status: 'PARTIAL',
    },
    {
      id: '3',
      invoiceNo: 'INV-003',
      patientName: 'Bob Johnson',
      services: 'Surgery, Medications',
      amount: 8750.00,
      paid: 0,
      balance: 8750.00,
      date: '2024-10-27',
      status: 'PENDING',
    },
    {
      id: '4',
      invoiceNo: 'INV-004',
      patientName: 'Alice Williams',
      services: 'Vaccination, Consultation',
      amount: 450.00,
      paid: 450.00,
      balance: 0,
      date: '2024-10-27',
      status: 'PAID',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-700';
      case 'PARTIAL':
        return 'bg-yellow-100 text-yellow-700';
      case 'PENDING':
        return 'bg-red-100 text-red-700';
      case 'OVERDUE':
        return 'bg-red-200 text-red-800';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Billing</h1>
          <p className="text-gray-600 mt-1">Manage invoices and payment records</p>
        </div>
        <Button icon={Plus}>
          Create Invoice
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Today\'s Revenue', value: '$12,450', color: 'green' },
          { label: 'Pending Payments', value: '$28,500', color: 'yellow' },
          { label: 'Total Invoices', value: '142', color: 'blue' },
          { label: 'Collection Rate', value: '87%', color: 'purple' },
        ].map((stat, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <DollarSign className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Methods</h2>
          <div className="space-y-3">
            {[
              { method: 'Cash', amount: '$4,200', percentage: '34%' },
              { method: 'Credit Card', amount: '$5,800', percentage: '47%' },
              { method: 'Insurance', amount: '$2,450', percentage: '19%' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{item.method}</p>
                  <p className="text-sm text-gray-600">{item.percentage} of total</p>
                </div>
                <span className="font-bold text-gray-900">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Services</h2>
          <div className="space-y-3">
            {[
              { service: 'Consultations', revenue: '$3,500' },
              { service: 'Lab Tests', revenue: '$2,800' },
              { service: 'Imaging Studies', revenue: '$4,150' },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-900">{item.service}</span>
                <span className="font-bold text-gray-900">{item.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search invoices by number or patient name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <DataTable
          data={invoices}
          columns={[
            { header: 'Invoice #', accessor: 'invoiceNo' },
            { header: 'Patient', accessor: 'patientName' },
            { header: 'Services', accessor: 'services' },
            {
              header: 'Amount',
              accessor: (row) => `$${row.amount.toFixed(2)}`
            },
            {
              header: 'Paid',
              accessor: (row) => `$${row.paid.toFixed(2)}`
            },
            {
              header: 'Balance',
              accessor: (row) => (
                <span className={row.balance > 0 ? 'text-red-600 font-medium' : 'text-green-600'}>
                  ${row.balance.toFixed(2)}
                </span>
              )
            },
            { header: 'Date', accessor: 'date' },
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
                  {row.status !== 'PAID' && (
                    <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      Record Payment
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
