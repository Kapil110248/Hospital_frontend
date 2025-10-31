

import { useState } from "react";
import { FlaskConical, Search, Plus, FileCheck } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";

export function Laboratory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [labTests, setLabTests] = useState([
    {
      id: "1",
      testId: "LAB001",
      patientName: "John Doe",
      testType: "Complete Blood Count",
      orderedBy: "Dr. Sarah Wilson",
      orderedDate: "2025-10-28",
      status: "PENDING",
    },
    {
      id: "2",
      testId: "LAB002",
      patientName: "Jane Smith",
      testType: "Lipid Profile",
      orderedBy: "Dr. Michael Chen",
      orderedDate: "2024-10-28",
      status: "IN_PROGRESS",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    patientName: "",
    testType: "",
    orderedBy: "",
    status: "PENDING",
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrder = {
      id: Date.now().toString(),
      testId: `LAB${(labTests.length + 1).toString().padStart(3, "0")}`,
      patientName: formData.patientName,
      testType: formData.testType,
      orderedBy: formData.orderedBy,
      orderedDate: new Date().toISOString().split("T")[0],
      status: formData.status,
    };
    setLabTests([newOrder, ...labTests]);
    setIsModalOpen(false);
    setFormData({ patientName: "", testType: "", orderedBy: "", status: "PENDING" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Laboratory
          </h1>
          <p className="text-gray-600 mt-1">Manage lab tests and results</p>
        </div>
        <Button icon={Plus} onClick={() => setIsModalOpen(true)}>
          Create Lab Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Today", value: labTests.length, icon: FlaskConical, color: "blue" },
          { label: "Pending", value: labTests.filter(t => t.status === "PENDING").length, icon: FlaskConical, color: "yellow" },
          { label: "In Progress", value: labTests.filter(t => t.status === "IN_PROGRESS").length, icon: FlaskConical, color: "purple" },
          { label: "Completed", value: labTests.filter(t => t.status === "COMPLETED").length, icon: FileCheck, color: "green" },
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
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lab Tests Table */}
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
          data={labTests.filter(
            (t) =>
              t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.testType.toLowerCase().includes(searchQuery.toLowerCase()) ||
              t.testId.toLowerCase().includes(searchQuery.toLowerCase())
          )}
          columns={[
            { header: "Test ID", accessor: "testId" },
            { header: "Patient", accessor: "patientName" },
            { header: "Test Type", accessor: "testType" },
            { header: "Ordered By", accessor: "orderedBy" },
            { header: "Date", accessor: "orderedDate" },
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
      </div>

      {/* Modal Form */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Lab Order"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Patient Name</label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Test Type</label>
            <input
              type="text"
              value={formData.testType}
              onChange={(e) => setFormData({ ...formData, testType: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Ordered By</label>
            <input
              type="text"
              value={formData.orderedBy}
              onChange={(e) => setFormData({ ...formData, orderedBy: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 mt-1"
            >
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" onClick={() => setIsModalOpen(false)} variant="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
