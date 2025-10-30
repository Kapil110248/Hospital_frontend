import { useState } from "react";
import { Activity, Search, Plus, FileImage } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";

export function Radiology() {
  const [searchQuery, setSearchQuery] = useState("");

  const radiologyOrders = [
    {
      id: "1",
      orderId: "RAD001",
      patientName: "John Doe",
      studyType: "Chest X-Ray",
      orderedBy: "Dr. Sarah Wilson",
      orderedDate: "2024-10-28",
      status: "PENDING",
    },
    {
      id: "2",
      orderId: "RAD002",
      patientName: "Jane Smith",
      studyType: "MRI Brain",
      orderedBy: "Dr. Michael Chen",
      orderedDate: "2024-10-28",
      status: "IN_PROGRESS",
    },
    {
      id: "3",
      orderId: "RAD003",
      patientName: "Bob Johnson",
      studyType: "CT Scan Abdomen",
      orderedBy: "Dr. Emily Brown",
      orderedDate: "2024-10-27",
      status: "COMPLETED",
    },
    {
      id: "4",
      orderId: "RAD004",
      patientName: "Alice Williams",
      studyType: "Ultrasound",
      orderedBy: "Dr. David Lee",
      orderedDate: "2024-10-27",
      status: "REPORTED",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-700";
      case "COMPLETED":
        return "bg-purple-100 text-purple-700";
      case "REPORTED":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Radiology
          </h1>
          <p className="text-gray-600 mt-1">
            Manage imaging studies and reports
          </p>
        </div>
        <Button icon={Plus}>Create Radiology Order</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Today", value: "18", icon: Activity, color: "blue" },
          { label: "Pending", value: "5", icon: Activity, color: "yellow" },
          { label: "In Progress", value: "7", icon: Activity, color: "purple" },
          { label: "Completed", value: "6", icon: FileImage, color: "green" },
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

      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Common Imaging Studies
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            "Chest X-Ray",
            "CT Scan",
            "MRI",
            "Ultrasound",
            "Mammography",
            "Fluoroscopy",
            "PET Scan",
            "Bone Scan",
          ].map((study, index) => (
            <button
              key={index}
              className="px-4 py-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
            >
              {study}
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
              placeholder="Search orders by ID, patient, or study type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <DataTable
          data={radiologyOrders}
          columns={[
            { header: "Order ID", accessor: "orderId" },
            { header: "Patient", accessor: "patientName" },
            { header: "Study Type", accessor: "studyType" },
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
            {
              header: "Actions",
              accessor: (row) => (
                <div className="flex items-center gap-2">
                  {row.status === "REPORTED" || row.status === "COMPLETED" ? (
                    <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      View Report
                    </button>
                  ) : (
                    <button className="px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                      Update Status
                    </button>
                  )}
                  {row.status === "COMPLETED" && (
                    <button className="px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                      Add Report
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
