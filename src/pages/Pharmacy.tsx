import { useState } from 'react';
import { Pill, Search, Plus, AlertCircle } from 'lucide-react';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';

export function Pharmacy() {
  const [searchQuery, setSearchQuery] = useState('');

  const medications = [
    {
      id: '1',
      name: 'Aspirin',
      genericName: 'Acetylsalicylic Acid',
      strength: '75mg',
      stock: 500,
      reorderLevel: 100,
      expiryDate: '2025-12-31',
      status: 'IN_STOCK',
    },
    {
      id: '2',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      strength: '10mg',
      stock: 45,
      reorderLevel: 50,
      expiryDate: '2025-06-30',
      status: 'LOW_STOCK',
    },
    {
      id: '3',
      name: 'Metformin',
      genericName: 'Metformin HCl',
      strength: '500mg',
      stock: 300,
      reorderLevel: 100,
      expiryDate: '2026-03-15',
      status: 'IN_STOCK',
    },
    {
      id: '4',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      strength: '500mg',
      stock: 15,
      reorderLevel: 50,
      expiryDate: '2025-02-28',
      status: 'CRITICAL',
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'IN_STOCK':
        return 'bg-green-100 text-green-700';
      case 'LOW_STOCK':
        return 'bg-yellow-100 text-yellow-700';
      case 'CRITICAL':
        return 'bg-red-100 text-red-700';
      case 'OUT_OF_STOCK':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Pharmacy</h1>
          <p className="text-gray-600 mt-1">Manage medication inventory and stock levels</p>
        </div>
        <Button icon={Plus}>
          Add Medication
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Items', value: '234', color: 'blue' },
          { label: 'In Stock', value: '198', color: 'green' },
          { label: 'Low Stock', value: '28', color: 'yellow' },
          { label: 'Out of Stock', value: '8', color: 'red' },
        ].map((stat, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <Pill className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 bg-red-100 rounded-lg">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 mb-1">Low Stock Alerts</h3>
            <p className="text-sm text-gray-600">4 medications below reorder level</p>
          </div>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search medications by name or generic name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <DataTable
          data={medications}
          columns={[
            { header: 'Brand Name', accessor: 'name' },
            { header: 'Generic Name', accessor: 'genericName' },
            { header: 'Strength', accessor: 'strength' },
            {
              header: 'Stock',
              accessor: (row) => (
                <span className={row.stock <= row.reorderLevel ? 'text-red-600 font-medium' : ''}>
                  {row.stock}
                </span>
              )
            },
            { header: 'Reorder Level', accessor: 'reorderLevel' },
            { header: 'Expiry Date', accessor: 'expiryDate' },
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
                  <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    Restock
                  </button>
                  <button className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Edit
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>
    </div>
  );
}
