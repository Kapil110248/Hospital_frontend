import { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit2, Eye } from 'lucide-react';
import { Button } from '../components/common/Button';
import { DataTable } from '../components/common/DataTable';
import { Modal } from '../components/common/Modal';
import { PatientRegistrationForm } from '../components/forms/PatientRegistrationForm';
import { patientsApi } from '../services/api/patients';

export function Patients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await patientsApi.getAll();
      setPatients(data || []);
    } catch (error) {
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewPatient = async (patientId: string) => {
    try {
      const patient = await patientsApi.getById(patientId);
      setSelectedPatient(patient);
      setViewModalOpen(true);
    } catch (error) {
      console.error('Error loading patient details:', error);
    }
  };

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPatients = patients.filter(patient =>
    searchQuery === '' ||
    patient.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.last_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.upid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">Manage patient records and information</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Register New Patient
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Patients', value: patients.length.toString(), color: 'blue' },
          { label: 'OPD Patients', value: patients.filter(p => p.status === 'OPD').length.toString(), color: 'green' },
          { label: 'IPD Patients', value: patients.filter(p => p.status === 'IPD').length.toString(), color: 'orange' },
        ].map((stat, index) => (
          <div key={index} className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <Users className={`w-6 h-6 text-${stat.color}-600`} />
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
              placeholder="Search patients by name, UPID, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading patients...</p>
          </div>
        ) : (
          <DataTable
            data={filteredPatients}
            columns={[
              { header: 'UPID', accessor: 'upid' },
              {
                header: 'Name',
                accessor: (row) => `${row.first_name} ${row.last_name}`
              },
              {
                header: 'Age',
                accessor: (row) => calculateAge(row.date_of_birth)
              },
              { header: 'Gender', accessor: 'gender' },
              { header: 'Phone', accessor: 'phone' },
              {
                header: 'Status',
                accessor: (row) => (
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    row.status === 'OPD' ? 'bg-green-100 text-green-700' :
                    row.status === 'IPD' ? 'bg-orange-100 text-orange-700' :
                    row.status === 'EMERGENCY' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {row.status}
                  </span>
                ),
              },
              {
                header: 'Actions',
                accessor: (row) => (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleViewPatient(row.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedPatient(row);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit Patient"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPatient(null);
        }}
        title={selectedPatient ? 'Edit Patient' : 'Register New Patient'}
      >
        <PatientRegistrationForm
          patient={selectedPatient}
          onSuccess={() => {
            setIsModalOpen(false);
            setSelectedPatient(null);
            loadPatients();
          }}
        />
      </Modal>

      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedPatient(null);
        }}
        title="Patient Details"
      >
        {selectedPatient && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">UPID</p>
                <p className="font-medium">{selectedPatient.upid}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-medium">{selectedPatient.first_name} {selectedPatient.last_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">{new Date(selectedPatient.date_of_birth).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium">{selectedPatient.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium">{selectedPatient.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{selectedPatient.email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Blood Group</p>
                <p className="font-medium">{selectedPatient.blood_group || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="font-medium">{selectedPatient.status}</p>
              </div>
            </div>
            {selectedPatient.address && (
              <div>
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium">{selectedPatient.address}</p>
              </div>
            )}
            {selectedPatient.allergies && (
              <div>
                <p className="text-sm text-gray-600">Allergies</p>
                <p className="font-medium text-red-600">{selectedPatient.allergies}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
