// import { useState, useEffect } from 'react';
// import { Button } from '../common/Button';
// import { createAppointment, getDepartments, getPatients } from '../../services/api';

// export function AppointmentBookingForm({ onSuccess, onCancel, patientId }) {
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [patients, setPatients] = useState([]);
//   const [departments, setDepartments] = useState([]);
//   const [loadingData, setLoadingData] = useState(true);

//   const [formData, setFormData] = useState({
//     patientId: patientId || '',
//     doctorId: '',
//     scheduledDate: '',
//     scheduledTime: '',
//     type: 'CONSULTATION',
//     reason: '',
//     duration: '30',
//   });

//   useEffect(() => {
//     loadFormData();
//   }, []);

//   const loadFormData = async () => {
//     try {
//       const [patientsData, departmentsData] = await Promise.all([
//         getPatients(50),
//         getDepartments(),
//       ]);
//       setPatients(patientsData);
//       setDepartments(departmentsData);
//     } catch (err) {
//       console.error('Error loading form data:', err);
//     } finally {
//       setLoadingData(false);
//     }
//   };

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     setLoading(true);

//     try {
//       const scheduledAt = `${formData.scheduledDate}T${formData.scheduledTime}:00`;

//       const appointment = await createAppointment({
//         patientId: formData.patientId,
//         doctorId: formData.doctorId || 'dummy-doctor-id',
//         scheduledAt,
//         type: formData.type,
//         reason: formData.reason,
//         duration: parseInt(formData.duration),
//       });

//       if (onSuccess) onSuccess(appointment);
//     } catch (err) {
//       setError(err.message || 'Failed to book appointment');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loadingData) {
//     return <div className="text-center py-8">Loading...</div>;
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {error && (
//         <div className="p-3 bg-error-50 border border-error-500 rounded-lg text-error-600 text-sm">
//           {error}
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {/* Patient Selection */}
//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Patient <span className="text-error-500">*</span>
//           </label>
//           <select
//             name="patientId"
//             value={formData.patientId}
//             onChange={handleChange}
//             required
//             disabled={!!patientId}
//             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hospital-purple focus:border-transparent"
//           >
//             <option value="">Select Patient</option>
//             {patients.map((patient) => (
//               <option key={patient.id} value={patient.id}>
//                 {patient.firstName} {patient.lastName} - {patient.upid}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Department */}
//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Department
//           </label>
//           <select
//             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hospital-purple focus:border-transparent"
//           >
//             <option value="">Select Department</option>
//             {departments.map((dept) => (
//               <option key={dept.id} value={dept.id}>
//                 {dept.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Appointment Type */}
//         <div className="md:col-span-2">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Appointment Type <span className="text-error-500">*</span>
//           </label>
//           <select
//             name="type"
//             value={formData.type}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hospital-purple focus:border-transparent"
//           >
//             <option value="CONSULTATION">Consultation</option>
//             <option value="FOLLOW_UP">Follow-up</option>
//             <option value="PROCEDURE">Procedure</option>
//             <option value="EMERGENCY">Emergency</option>
//           </select>
//         </div>

//         {/* Date */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Date <span className="text-error-500">*</span>
//           </label>
//           <input
//             type="date"
//             name="scheduledDate"
//             value={formData.scheduledDate}
//             onChange={handleChange}
//             required
//             min={new Date().toISOString().split('T')[0]}
//             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hospital-purple focus:border-transparent"
//           />
//         </div>

//         {/* Time */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Time <span className="text-error-500">*</span>
//           </label>
//           <input
//             type="time"
//             name="scheduledTime"
//             value={formData.scheduledTime}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hospital-purple focus:border-transparent"
//           />
//         </div>

//         {/* Duration */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Duration (minutes) <span className="text-error-500">*</span>
//           </label>
//           <select
//             name="duration"
//             value={formData.duration}
//             onChange={handleChange}
//             required
//             className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hospital-purple focus:border-transparent"
//           >
//             <option value="15">15 minutes</option>
//             <option value="30">30 minutes</option>
//             <option value="45">45 minutes</option>
//             <option value="60">1 hour</option>
//             <option value="90">1.5 hours</option>
//           </select>
//         </div>
//       </div>

//       {/* Reason */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-1">
//           Reason for Visit
//         </label>
//         <textarea
//           name="reason"
//           value={formData.reason}
//           onChange={handleChange}
//           rows={3}
//           placeholder="Describe the reason for this appointment..."
//           className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-hospital-purple focus:border-transparent"
//         />
//       </div>

//       {/* Buttons */}
//       <div className="flex gap-3 justify-end">
//         {onCancel && (
//           <Button type="button" variant="secondary" onClick={onCancel}>
//             Cancel
//           </Button>
//         )}
//         <Button type="submit" variant="primary" disabled={loading}>
//           {loading ? 'Booking...' : 'Book Appointment'}
//         </Button>
//       </div>
//     </form>
//   );
// }

import React, { useState } from "react";
import { Button } from "../common/Button";

export function AppointmentBookingForm({ onSuccess, initialData, isEdit }) {
  const [formData, setFormData] = useState(
    initialData || {
      patientName: "",
      doctorName: "",
      department: "",
      scheduledAt: "",
      status: "",
    }
  );

  const patients = ["John Doe", "Jane Smith", "Bob Johnson", "Alice Williams", "Akash Pathak"];

  const doctors = ["Dr. Sarah Wilson", "Dr. Michael Chen", "Dr. Emily Brown", "Dr. David Lee"];

  const departments = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Radiology"];

  const status = ["CONFIRMED","WAITING","IN_CONSULTATION","COMPLETED","CANCELLED"];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess({ ...formData, id: initialData?.id || Date.now().toString() });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Patient Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Patient Name</label>
        <select
          name="patientName"
          value={formData.patientName}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      {/* Doctor Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Doctor Name</label>
        <select name="doctorName" 
        value={formData.doctorName}
        onChange={handleChange} 
        className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        required>
          <option value="">Select Doctor</option>
          {doctors.map((d)=> (
            <option key={d} value={d}>
              {d}
              </option>
          ))}
        </select>
      
      </div>

      {/* Department Select */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Department</label>
        <select
          name="department"
          value={formData.department}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select Department</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* Scheduled Time */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Scheduled At</label>
        <input
          type="datetime-local"
          name="scheduledAt"
          value={formData.scheduledAt}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      {/* Status (only for edit mode) */}
      {/* {isEdit && ( */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required>
            {/* {["CONFIRMED", "WAITING", "IN_CONSULTATION", "COMPLETED", "CANCELLED"].map(
              (status) => ( */}
              <option value="">Select Status</option>
              {status.map((s)=>(

             

           
                <option key={s} value={s}>
                  {/* {status.replace("_", " ")} */}
                  {s}
                </option>
              ))}
          </select>
        </div>
      {/* )} */}

      <Button type="submit" className="w-full">
        {isEdit ? "Update Appointment" : "Book Appointment"}
      </Button>
    </form>
  );
}
