import { useState } from "react";
import { Users, Plus, Search, Edit2, Eye, Trash2 } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import { PatientRegistrationForm } from "../components/forms/PatientRegistrationForm";

// 💡 Initial Demo Data (All keys must be in camelCase to match the component logic)
const INITIAL_PATIENTS = [
  {
    id: 101,
    upid: "UPID10001",
    firstName: "Aarav",
    lastName: "Sharma",
    fatherName: "Rajesh Sharma", // ✅ ADDED: Father's Name
    dateOfBirth: "1995-05-15",
    gender: "MALE",
    phone: "9876543210",
    email: "aarav.s@example.com",
    address: "B-20, Green Park, Delhi",
    bloodGroup: "O+",
    height: 175,
    weight: 78,
    nationalId: "IN9505151234",
    currentTreatment: "Hypertension medication",
    medicalHistory: "Childhood asthma, no current issues.",
    allergies: "Penicillin",
    insuranceProvider: "LifeCover India",
    insurancePolicyNumber: "LCI98765",
    emergencyContactName: "Priya Sharma",
    emergencyContactPhone: "9876543211",
    status: "OPD",
  },
  {
    id: 102,
    upid: "UPID10002",
    firstName: "Diya",
    lastName: "Verma",
    fatherName: "Sanjay Verma", // ✅ ADDED: Father's Name
    dateOfBirth: "1988-11-20",
    gender: "FEMALE",
    phone: "9123456789",
    email: "diya.v@example.com",
    address: "45, Silver Heights, Mumbai",
    bloodGroup: "A-",
    height: 162,
    weight: 65,
    nationalId: "IN8811205678",
    currentTreatment: "Post-surgery follow-up",
    medicalHistory: "Appendectomy (2020)",
    allergies: "None",
    insuranceProvider: "HealthPlus",
    insurancePolicyNumber: "HP234567",
    emergencyContactName: "Rohan Verma",
    emergencyContactPhone: "9123456790",
    status: "IPD", // In-Patient Department
  },
  {
    id: 103,
    upid: "UPID10003",
    firstName: "Kabir",
    lastName: "Singh",
    fatherName: "Vikram Singh", // ✅ ADDED: Father's Name
    dateOfBirth: "2010-02-01",
    gender: "MALE",
    phone: "8000112233",
    email: "kabir.s@example.com",
    address: "F-10, Gold Apartments, Bangalore",
    bloodGroup: "B+",
    height: 140,
    weight: 35,
    nationalId: "IN1002019012",
    currentTreatment: "Annual check-up",
    medicalHistory: "Standard childhood vaccinations.",
    allergies: "Dust",
    insuranceProvider: "CareMax",
    insurancePolicyNumber: "CM789012",
    emergencyContactName: "Neha Singh (Mother)",
    emergencyContactPhone: "8000112234",
    status: "OPD",
  },
];

// 💡 Helper function to ensure data is camelCase
const normalizePatientKeys = (patient) => {
  if (!patient) return {};
  // Create a new object to ensure all keys are camelCase for local state and display
  return {
    ...patient, // Keep all existing keys
    // Override/Ensure camelCase based on snake_case fallback
    firstName: patient.firstName || patient.first_name,
    lastName: patient.lastName || patient.last_name,
    fatherName: patient.fatherName || patient.father_name, // ✅ Father's Name
    dateOfBirth: patient.dateOfBirth || patient.date_of_birth,
    bloodGroup: patient.bloodGroup || patient.blood_group,
    nationalId: patient.nationalId || patient.national_id,
    currentTreatment: patient.currentTreatment || patient.current_treatment,
    medicalHistory: patient.medicalHistory || patient.medical_history,
    insuranceProvider: patient.insuranceProvider || patient.insurance_provider,
    insurancePolicyNumber: patient.insurancePolicyNumber || patient.insurance_policy_number,
    emergencyContactName: patient.emergencyContactName || patient.emergency_contact_name,
    emergencyContactPhone: patient.emergencyContactPhone || patient.emergency_contact_phone,
    // Ensure ID and UPID are present
    id: patient.id || Date.now(),
    upid: patient.upid || ("UPID" + Date.now()),
    status: patient.status || "OPD", // Default status
  };
};


export function Patients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  // ✅ INITIAL STATE NOW USES DEMO DATA
  const [patients, setPatients] = useState(INITIAL_PATIENTS); 
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // 🛑 FIX: The most robust Age calculator, which ignores timezones.
  const calculateAge = (dob) => {
    if (!dob) return "-";
    
    // 1. Get today's components in local time
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // Month is 0-indexed, so add 1
    const currentDay = today.getDate();

    // 2. Parse DOB components (e.g., "2010-02-01" -> [2010, 2, 1])
    const [birthYear, birthMonth, birthDay] = dob.split('-').map(Number);
    
    // 3. Calculate year difference
    let age = currentYear - birthYear;
    
    // 4. Adjust age if the birthday hasn't occurred this year
    if (
      currentMonth < birthMonth || 
      (currentMonth === birthMonth && currentDay < birthDay)
    ) {
      age--;
    }

    return age;
  };


  // ✅ Called when patient form submits successfully
  const handleRegisterSuccess = (newPatient) => {
    // Normalize the patient data to ensure all keys are camelCase
    const normalizedPatient = normalizePatientKeys(newPatient);
    
    if (selectedPatient) {
      // Update existing patient
      setPatients((prev) =>
        prev.map((p) => (p.id === selectedPatient.id ? { ...p, ...normalizedPatient } : p))
      );
    } else {
      // Add new patient 
      setPatients((prev) => [
        normalizedPatient,
        ...prev,
      ]);
    }
    setSelectedPatient(null);
    setIsModalOpen(false);
  };

  // 🗑️ Delete Patient
  const handleDeletePatient = (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      setPatients((prev) => prev.filter((p) => p.id !== id));
    }
  };

  // ✅ Filter for search
  const filteredPatients = patients.filter(
    (patient) =>
      searchQuery === "" ||
      patient.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.fatherName?.toLowerCase().includes(searchQuery.toLowerCase()) || // ✅ Search by Father's Name
      patient.upid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header (No change) */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Patients</h1>
          <p className="text-gray-600 mt-1">
            Manage patient records and information
          </p>
        </div>
        <Button
          onClick={() => {
            setSelectedPatient(null);
            setIsModalOpen(true);
          }}
          icon={Plus}
        >
          Register New Patient
        </Button>
      </div>

      {/* Stats (No change) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Patients", value: patients.length, color: "blue" },
          {
            label: "OPD Patients",
            value: patients.filter((p) => p.status === "OPD").length,
            color: "green",
          },
          {
            label: "IPD Patients",
            value: patients.filter((p) => p.status === "IPD").length,
            color: "orange",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.value}
                </p>
              </div>
              <div className={`p-3 bg-${stat.color}-100 rounded-lg`}>
                <Users className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search + Table */}
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

        {filteredPatients.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No patients found. Register a new one!
          </p>
        ) : (
          <DataTable
            data={filteredPatients}
            columns={[
              { header: "UPID", accessor: "upid" },
              {
                header: "Name",
                accessor: (row) => `${row.firstName} ${row.lastName}`,
              },
              // ✅ Father's Name column
              { header: "Father's Name", accessor: "fatherName" }, 
              
              { header: "Age", accessor: (row) => calculateAge(row.dateOfBirth) },
              { header: "Gender", accessor: "gender" },
              { header: "Phone", accessor: "phone" },
              {
                header: "Status",
                accessor: (row) => (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      row.status === "OPD"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {row.status}
                  </span>
                ),
              },
              {
                header: "Actions",
                accessor: (row) => (
                  <div className="flex items-center gap-2">
                    {/* View */}
                    <button
                      onClick={() => {
                        setSelectedPatient(row);
                        setViewModalOpen(true);
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => {
                        setSelectedPatient(row);
                        setIsModalOpen(true);
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeletePatient(row.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ]}
          />
        )}
      </div>

      {/* Register/Edit Modal (No change) */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPatient(null);
        }}
        title={selectedPatient ? "Edit Patient" : "Register New Patient"}
      >
        {/* Pass the normalizePatientKeys function for initial data loading */}
        <PatientRegistrationForm
          patient={selectedPatient ? normalizePatientKeys(selectedPatient) : null} 
          onSuccess={handleRegisterSuccess}
        />
      </Modal>

      {/* View Modal - UPDATED */}
      <Modal
        isOpen={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedPatient(null);
        }}
        title="Patient Details"
      >
        {selectedPatient && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800">
            <p><strong>UPID:</strong> {selectedPatient.upid}</p>
            <p><strong>First Name:</strong> {selectedPatient.firstName}</p>
            <p><strong>Last Name:</strong> {selectedPatient.lastName}</p>
            {/* ✅ Display Father's Name in the details modal */}
            <p><strong>Father's Name:</strong> {selectedPatient.fatherName || "—"}</p> 
            <p><strong>Date of Birth:</strong> {selectedPatient.dateOfBirth}</p>
            {/* 🛑 Age display uses the corrected function */}
            <p><strong>Age:</strong> {calculateAge(selectedPatient.dateOfBirth)}</p>
            <p><strong>Gender:</strong> {selectedPatient.gender}</p>
            <p><strong>Phone:</strong> {selectedPatient.phone}</p>
            <p><strong>Email:</strong> {selectedPatient.email || "—"}</p>
            <p><strong>Address:</strong> {selectedPatient.address || "—"}</p>
            <p><strong>Blood Group:</strong> {selectedPatient.bloodGroup || "—"}</p>
            <p><strong>Height:</strong> {selectedPatient.height || "—"} cm</p>
            <p><strong>Weight:</strong> {selectedPatient.weight || "—"} kg</p>
            <p><strong>Current Treatment:</strong> {selectedPatient.currentTreatment || "—"}</p>
            <p><strong>Allergies:</strong> {selectedPatient.allergies || "—"}</p>
            <p><strong>Medical History:</strong> {selectedPatient.medicalHistory || "—"}</p>
            <p><strong>National ID:</strong> {selectedPatient.nationalId || "—"}</p>
            <p><strong>Insurance Provider:</strong> {selectedPatient.insuranceProvider || "—"}</p>
            <p><strong>Policy Number:</strong> {selectedPatient.insurancePolicyNumber || "—"}</p>
            <p><strong>Emergency Contact Name:</strong> {selectedPatient.emergencyContactName || "—"}</p>
            <p><strong>Emergency Contact Phone:</strong> {selectedPatient.emergencyContactPhone || "—"}</p>
            <p><strong>Status:</strong> {selectedPatient.status || "OPD"}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}