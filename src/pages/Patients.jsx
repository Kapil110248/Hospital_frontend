import { useState } from "react";
import { Users, Plus, Search, Edit2, Eye, Trash2 } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import { PatientRegistrationForm } from "../components/forms/PatientRegistrationForm";

export function Patients() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [patients, setPatients] = useState([]); // Local-only
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  // ✅ Age calculator
  const calculateAge = (dob) => {
    if (!dob) return "-";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  // ✅ Called when patient form submits successfully
  const handleRegisterSuccess = (newPatient) => {
    if (selectedPatient) {
      // Update existing patient
      setPatients((prev) =>
        prev.map((p) => (p.id === selectedPatient.id ? { ...p, ...newPatient } : p))
      );
    } else {
      // Add new patient with fake ID + UPID
      const newId = Date.now();
      setPatients((prev) => [
        { ...newPatient, id: newId, upid: "UPID" + newId },
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
      patient.upid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.phone?.includes(searchQuery)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Stats */}
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

      {/* Register/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPatient(null);
        }}
        title={selectedPatient ? "Edit Patient" : "Register New Patient"}
      >
        <PatientRegistrationForm
          patient={selectedPatient}
          onSuccess={handleRegisterSuccess}
        />
      </Modal>

      {/* View Modal */}
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
            <p><strong>Date of Birth:</strong> {selectedPatient.dateOfBirth}</p>
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
