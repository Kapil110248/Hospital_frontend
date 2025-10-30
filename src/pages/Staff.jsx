import { useState } from "react";
import { UserCog, Search, Plus, Edit2, Eye } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";

export function Staff() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("ALL");

  const staffMembers = [
    {
      id: "1",
      employeeId: "EMP001",
      name: "Dr. Sarah Wilson",
      role: "DOCTOR",
      department: "Cardiology",
      phone: "555-1001",
      email: "sarah.wilson@hospital.com",
      status: "ACTIVE",
    },
    {
      id: "2",
      employeeId: "EMP002",
      name: "Dr. Michael Chen",
      role: "DOCTOR",
      department: "Neurology",
      phone: "555-1002",
      email: "michael.chen@hospital.com",
      status: "ACTIVE",
    },
    {
      id: "3",
      employeeId: "EMP003",
      name: "Mary Johnson",
      role: "NURSE",
      department: "Emergency",
      phone: "555-1003",
      email: "mary.johnson@hospital.com",
      status: "ACTIVE",
    },
    {
      id: "4",
      employeeId: "EMP004",
      name: "Robert Smith",
      role: "PHARMACIST",
      department: "Pharmacy",
      phone: "555-1004",
      email: "robert.smith@hospital.com",
      status: "ACTIVE",
    },
    {
      id: "5",
      employeeId: "EMP005",
      name: "Lisa Anderson",
      role: "LAB_TECH",
      department: "Laboratory",
      phone: "555-1005",
      email: "lisa.anderson@hospital.com",
      status: "ON_LEAVE",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "ON_LEAVE":
        return "bg-yellow-100 text-yellow-700";
      case "INACTIVE":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "DOCTOR":
        return "bg-blue-100 text-blue-700";
      case "NURSE":
        return "bg-purple-100 text-purple-700";
      case "PHARMACIST":
        return "bg-green-100 text-green-700";
      case "LAB_TECH":
        return "bg-orange-100 text-orange-700";
      case "RECEPTIONIST":
        return "bg-pink-100 text-pink-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Staff Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage hospital staff and personnel records
          </p>
        </div>
        <Button icon={Plus}>Add Staff Member</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Total Staff", value: "156", color: "blue" },
          { label: "Doctors", value: "45", color: "green" },
          { label: "Nurses", value: "68", color: "purple" },
          { label: "On Leave", value: "12", color: "yellow" },
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
                <UserCog className={`w-6 h-6 text-${stat.color}-600`} />
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
              placeholder="Search staff by name, ID, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {["ALL", "DOCTOR", "NURSE", "PHARMACIST", "LAB_TECH"].map(
              (role) => (
                <button
                  key={role}
                  onClick={() => setFilterRole(role)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    filterRole === role
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {role.replace("_", " ")}
                </button>
              )
            )}
          </div>
        </div>

        <DataTable
          data={staffMembers}
          columns={[
            { header: "Employee ID", accessor: "employeeId" },
            { header: "Name", accessor: "name" },
            {
              header: "Role",
              accessor: (row) => (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(
                    row.role
                  )}`}
                >
                  {row.role.replace("_", " ")}
                </span>
              ),
            },
            { header: "Department", accessor: "department" },
            { header: "Phone", accessor: "phone" },
            { header: "Email", accessor: "email" },
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
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              ),
            },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Department Distribution
          </h2>
          <div className="space-y-3">
            {[
              { department: "Emergency", count: 24 },
              { department: "Surgery", count: 18 },
              { department: "Cardiology", count: 16 },
              { department: "Pediatrics", count: 14 },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="font-medium text-gray-900">
                  {item.department}
                </span>
                <span className="font-bold text-gray-900">
                  {item.count} staff
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Upcoming Leave Requests
          </h2>
          <div className="space-y-3">
            {[
              {
                name: "Dr. Emily Brown",
                dates: "Nov 1-5, 2024",
                type: "Vacation",
              },
              {
                name: "Nurse Sarah Lee",
                dates: "Nov 8-10, 2024",
                type: "Medical",
              },
              {
                name: "Dr. James Wilson",
                dates: "Nov 15-20, 2024",
                type: "Conference",
              },
            ].map((item, index) => (
              <div key={index} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                    {item.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{item.dates}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
