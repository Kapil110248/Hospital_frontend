import { useState } from "react";
import { FileText, Search, Plus, Download, X } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";

export function Prescriptions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [prescriptions, setPrescriptions] = useState([
    {
      id: "1",
      prescriptionNo: "RX001",
      patientName: "John Doe",
      doctorName: "Dr. Sarah Wilson",
      date: "2024-10-28",
      medications: "Aspirin 75mg, Lisinopril 10mg",
      status: "DISPENSED",
    },
    {
      id: "2",
      prescriptionNo: "RX002",
      patientName: "Jane Smith",
      doctorName: "Dr. Michael Chen",
      date: "2024-10-28",
      medications: "Metformin 500mg, Atorvastatin 20mg",
      status: "PENDING",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // Demo medicine list
  const medicinesList = [
    "Paracetamol 500mg",
    "Amoxicillin 250mg",
    "Ibuprofen 400mg",
    "Aspirin 75mg",
    "Lisinopril 10mg",
    "Metformin 500mg",
  ];

  const [newPrescription, setNewPrescription] = useState({
    patientName: "",
    doctorName: "",
    medicines: [
      { name: "", dosage: "", quantity: "", duration: "", instructions: "" },
    ],
    status: "PENDING",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "DISPENSED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleAddMedicineRow = () => {
    setNewPrescription({
      ...newPrescription,
      medicines: [
        ...newPrescription.medicines,
        { name: "", dosage: "", quantity: "", duration: "", instructions: "" },
      ],
    });
  };

  const handleMedicineChange = (index, field, value) => {
    const updated = [...newPrescription.medicines];
    updated[index][field] = value;
    setNewPrescription({ ...newPrescription, medicines: updated });
  };

  const handleCreate = () => {
    const newId = (prescriptions.length + 1).toString().padStart(3, "0");
    const newEntry = {
      id: newId,
      prescriptionNo: `RX${newId}`,
      patientName: newPrescription.patientName,
      doctorName: newPrescription.doctorName,
      date: new Date().toISOString().split("T")[0],
      medications: newPrescription.medicines
        .map(
          (m) =>
            `${m.name} (${m.dosage || "N/A"}, ${m.quantity || 1} qty, ${
              m.duration || "?" 
            } days)`
        )
        .join("; "),
      status: "PENDING",
    };

    setPrescriptions([...prescriptions, newEntry]);
    setIsModalOpen(false);
    setNewPrescription({
      patientName: "",
      doctorName: "",
      medicines: [{ name: "", dosage: "", quantity: "", duration: "", instructions: "" }],
      status: "PENDING",
    });
  };

  const handleDispense = (id) => {
    setPrescriptions((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: "DISPENSED" } : p
      )
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Prescriptions
          </h1>
          <p className="text-gray-600 mt-1">
            Manage patient prescriptions and medications
          </p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create Prescription
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total", value: prescriptions.length, color: "blue" },
          { label: "Pending", value: prescriptions.filter(p => p.status === "PENDING").length, color: "yellow" },
          { label: "Dispensed", value: prescriptions.filter(p => p.status === "DISPENSED").length, color: "green" },
        ].map((stat, index) => (
          <div
            key={index}
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
                <FileText className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <DataTable
          data={prescriptions.filter(
            (p) =>
              p.prescriptionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              p.doctorName.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          columns={[
            { header: "Prescription #", accessor: "prescriptionNo" },
            { header: "Patient", accessor: "patientName" },
            { header: "Doctor", accessor: "doctorName" },
            { header: "Date", accessor: "date" },
            { header: "Medications", accessor: "medications" },
            {
              header: "Status",
              accessor: (row) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    row.status
                  )}`}
                >
                  {row.status}
                </span>
              ),
            },
            {
              header: "Actions",
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                  {row.status === "PENDING" && (
                    <button
                      onClick={() => handleDispense(row.id)}
                      className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    >
                      Dispense
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Create Prescription Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold mb-4">Create Prescription</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient Name</label>
                <input
                  type="text"
                  value={newPrescription.patientName}
                  onChange={(e) =>
                    setNewPrescription({ ...newPrescription, patientName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter patient name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Doctor Name</label>
                <input
                  type="text"
                  value={newPrescription.doctorName}
                  onChange={(e) =>
                    setNewPrescription({ ...newPrescription, doctorName: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Enter doctor name"
                />
              </div>

              <div>
                <h3 className="text-md font-semibold mb-2">Medicines</h3>
                {newPrescription.medicines.map((med, index) => (
                  <div key={index} className="grid grid-cols-5 gap-2 mb-2">
                    <select
                      value={med.name}
                      onChange={(e) => handleMedicineChange(index, "name", e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1 col-span-2"
                    >
                      <option value="">Select Medicine</option>
                      {medicinesList.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Dosage"
                      value={med.dosage}
                      onChange={(e) => handleMedicineChange(index, "dosage", e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1"
                    />
                    <input
                      type="number"
                      placeholder="Qty"
                      value={med.quantity}
                      onChange={(e) => handleMedicineChange(index, "quantity", e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1"
                    />
                    <input
                      type="number"
                      placeholder="Days"
                      value={med.duration}
                      onChange={(e) => handleMedicineChange(index, "duration", e.target.value)}
                      className="border border-gray-300 rounded-lg px-2 py-1"
                    />
                  </div>
                ))}
                <Button variant="secondary" onClick={handleAddMedicineRow}>
                  + Add Medicine
                </Button>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Save Prescription</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
