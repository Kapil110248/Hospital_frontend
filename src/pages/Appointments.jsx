import React, { useState } from "react";
import { Calendar, Plus, Clock, User, CheckCircle } from "../lib/icons";
import { Button } from "../components/common/Button";
import { DataTable } from "../components/common/DataTable";
import { Modal } from "../components/common/Modal";
import { AppointmentBookingForm } from "../components/forms/AppointmentBookingForm";

export default function Appointments() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("ALL");

  const appointments = [
    {
      id: "1",
      tokenNumber: "T001",
      patientName: "John Doe",
      doctorName: "Dr. Sarah Wilson",
      department: "Cardiology",
      scheduledAt: "2024-10-28 10:00 AM",
      status: "CONFIRMED",
    },
    {
      id: "2",
      tokenNumber: "T002",
      patientName: "Jane Smith",
      doctorName: "Dr. Michael Chen",
      department: "Neurology",
      scheduledAt: "2024-10-28 11:00 AM",
      status: "WAITING",
    },
    {
      id: "3",
      tokenNumber: "T003",
      patientName: "Bob Johnson",
      doctorName: "Dr. Emily Brown",
      department: "Orthopedics",
      scheduledAt: "2024-10-28 02:00 PM",
      status: "IN_CONSULTATION",
    },
    {
      id: "4",
      tokenNumber: "T004",
      patientName: "Alice Williams",
      doctorName: "Dr. David Lee",
      department: "Pediatrics",
      scheduledAt: "2024-10-28 03:30 PM",
      status: "COMPLETED",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-blue-100 text-blue-700";
      case "WAITING":
        return "bg-yellow-100 text-yellow-700";
      case "IN_CONSULTATION":
        return "bg-purple-100 text-purple-700";
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">
            Appointments
          </h1>
          <p className="text-gray-600 mt-1">
            Manage and schedule patient appointments
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} icon={Plus}>
          Book Appointment
        </Button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Total",
            value: "48",
            icon: Calendar,
            color: "blue",
          },
          { label: "Waiting", value: "12", icon: Clock, color: "yellow" },
          { label: "In Progress", value: "5", icon: User, color: "purple" },
          {
            label: "Completed",
            value: "31",
            icon: CheckCircle,
            color: "green",
          },
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
              <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Appointment List */}
      <div className="bg-white/60 backdrop-blur-md rounded-xl shadow-soft p-6 border border-gray-100">
        {/* Filter Buttons */}
        <div className="flex items-center gap-4 mb-6">
          <div className="flex gap-2">
            {[
              "ALL",
              "CONFIRMED",
              "WAITING",
              "IN_CONSULTATION",
              "COMPLETED",
            ].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterStatus === status
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <DataTable
          data={appointments.filter(
            (a) => filterStatus === "ALL" || a.status === filterStatus
          )}
          columns={[
            { header: "Token", accessor: "tokenNumber" },
            { header: "Patient", accessor: "patientName" },
            { header: "Doctor", accessor: "doctorName" },
            { header: "Department", accessor: "department" },
            { header: "Scheduled Time", accessor: "scheduledAt" },
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
                  <button className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    View
                  </button>
                  {row.status !== "COMPLETED" && (
                    <button className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Modal for New Booking */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Book New Appointment"
      >
        <AppointmentBookingForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>
    </div>
  );
}
