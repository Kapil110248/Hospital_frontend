import { useState } from "react";
import { Pill, Search, Plus, AlertCircle } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";

/* 🧩 Add Medication Form Component */
function AddMedicationForm({ onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: "",
    genericName: "",
    strength: "",
    stock: "",
    reorderLevel: "",
    expiryDate: "",
    status: "IN_STOCK",
    manufacturer: "",
    batchNumber: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  // ✅ Validation Logic
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Brand name is required";
    if (!formData.genericName.trim()) newErrors.genericName = "Generic name is required";
    if (!formData.strength.trim()) newErrors.strength = "Strength is required";
    if (!formData.stock || formData.stock < 0) newErrors.stock = "Stock must be ≥ 0";
    if (!formData.reorderLevel || formData.reorderLevel < 0)
      newErrors.reorderLevel = "Reorder level must be ≥ 0";
    if (!formData.expiryDate) newErrors.expiryDate = "Expiry date is required";
    else if (new Date(formData.expiryDate) < new Date())
      newErrors.expiryDate = "Expiry date must be in the future";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔄 Auto-calculate status
  const computeStatus = (stock, reorderLevel) => {
    if (stock === 0) return "OUT_OF_STOCK";
    if (stock <= reorderLevel / 2) return "CRITICAL";
    if (stock <= reorderLevel) return "LOW_STOCK";
    return "IN_STOCK";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    if (name === "stock" || name === "reorderLevel") {
      updated.status = computeStatus(Number(updated.stock), Number(updated.reorderLevel));
    }

    setFormData(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-5 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Add New Medication</h2>
          <button
            type="button"
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Brand Name", name: "name", type: "text" },
              { label: "Generic Name", name: "genericName", type: "text" },
              { label: "Strength", name: "strength", type: "text" },
              { label: "Stock", name: "stock", type: "number" },
              { label: "Reorder Level", name: "reorderLevel", type: "number" },
              { label: "Expiry Date", name: "expiryDate", type: "date" },
              { label: "Manufacturer", name: "manufacturer", type: "text" },
              { label: "Batch Number", name: "batchNumber", type: "text" },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                  className="w-full border rounded-lg p-2 mt-1 text-sm"
                />
                {errors[field.name] && (
                  <p className="text-red-500 text-xs">{errors[field.name]}</p>
                )}
              </div>
            ))}

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 mt-1 text-sm bg-white"
              >
                <option value="IN_STOCK">In Stock</option>
                <option value="LOW_STOCK">Low Stock</option>
                <option value="CRITICAL">Critical</option>
                <option value="OUT_OF_STOCK">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              name="notes"
              rows="2"
              value={formData.notes}
              onChange={handleChange}
              className="w-full border rounded-lg p-2 mt-1 text-sm"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* 🧾 Main Pharmacy Component */
export function Pharmacy() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [medications, setMedications] = useState([
    {
      id: "1",
      name: "Aspirin",
      genericName: "Acetylsalicylic Acid",
      strength: "75mg",
      stock: 500,
      reorderLevel: 100,
      expiryDate: "2025-12-31",
      status: "IN_STOCK",
    },
    {
      id: "2",
      name: "Lisinopril",
      genericName: "Lisinopril",
      strength: "10mg",
      stock: 45,
      reorderLevel: 50,
      expiryDate: "2025-06-30",
      status: "LOW_STOCK",
    },
  ]);

  // 🟢 Status Color Mapping
  const getStatusColor = (status) => {
    switch (status) {
      case "IN_STOCK":
        return "bg-green-100 text-green-700";
      case "LOW_STOCK":
        return "bg-yellow-100 text-yellow-700";
      case "CRITICAL":
        return "bg-red-100 text-red-700";
      case "OUT_OF_STOCK":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // 💾 Add new medication handler
  const handleAddMedication = (newMed) => {
    const newRecord = {
      ...newMed,
      id: Date.now().toString(),
      stock: Number(newMed.stock),
      reorderLevel: Number(newMed.reorderLevel),
    };
    setMedications((prev) => [...prev, newRecord]);
    setShowForm(false);
  };

  // 🔍 Filter medications
  const filteredMeds = medications.filter((m) =>
    `${m.name} ${m.genericName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Pharmacy</h1>
          <p className="text-gray-600 mt-1">Manage medication inventory and stock levels</p>
        </div>
        <Button icon={Plus} onClick={() => setShowForm(true)}>
          Add Medication
        </Button>
      </div>

      {/* Search Section */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <div className="relative w-full md:w-1/2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search medications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        data={filteredMeds}
        columns={[
          { header: "Brand Name", accessor: "name" },
          { header: "Generic Name", accessor: "genericName" },
          { header: "Strength", accessor: "strength" },
          {
            header: "Stock",
            accessor: (row) => (
              <span
                className={
                  row.stock <= row.reorderLevel ? "text-red-600 font-medium" : ""
                }
              >
                {row.stock}
              </span>
            ),
          },
          { header: "Reorder Level", accessor: "reorderLevel" },
          { header: "Expiry Date", accessor: "expiryDate" },
          {
            header: "Status",
            accessor: (row) => (
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  row.status
                )}`}
              >
                {row.status.replace("_", " ")}
              </span>
            ),
          },
        ]}
      />

      {/* Modal Form */}
      {showForm && (
        <AddMedicationForm
          onSubmit={handleAddMedication}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
