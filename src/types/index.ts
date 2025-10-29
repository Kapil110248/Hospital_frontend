export enum UserRole {
  ADMIN = 'ADMIN',
  DOCTOR = 'DOCTOR',
  NURSE = 'NURSE',
  RECEPTIONIST = 'RECEPTIONIST',
  PHARMACIST = 'PHARMACIST',
  LAB_TECH = 'LAB_TECH',
  RADIOLOGIST = 'RADIOLOGIST',
  FINANCE = 'FINANCE',
  HR = 'HR',
  PATIENT = 'PATIENT',
  AUDITOR = 'AUDITOR',
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser extends User {
  staff?: Staff;
  patient?: Patient;
}

export interface Staff {
  id: string;
  userId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  dateOfBirth: string;
  gender: string;
  address?: string;
  departmentId?: string;
  specializationId?: string;
  isActive: boolean;
}

export interface Patient {
  id: string;
  userId?: string;
  upid: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email?: string;
  address?: string;
  status: 'OPD' | 'IPD' | 'DISCHARGED' | 'EMERGENCY' | 'DECEASED';
  bloodGroup?: string;
  allergies?: string;
  age?: number;
  height?: number;
  weight?: number;
  currentTreatment?: string;
  nationalId?: string;
  medicalHistory?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
}

export interface Appointment {
  id: string;
  tokenNumber: string;
  patientId: string;
  doctorId: string;
  scheduledAt: string;
  duration: number;
  type: string;
  reason?: string;
  status: 'SCHEDULED' | 'CHECKED_IN' | 'IN_CONSULTATION' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';
  patient?: Patient;
  doctor?: Staff;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
}

export interface DashboardStats {
  totalPatients?: number;
  totalStaff?: number;
  totalRevenue?: number;
  todayAppointments?: number;
  pendingPayments?: number;
  admissions?: number;
}

export interface Encounter {
  id: string;
  appointmentId?: string;
  patientId: string;
  doctorId: string;
  chiefComplaint?: string;
  symptoms?: string;
  diagnosis?: string;
  notes?: string;
  heightCm?: number;
  weightKg?: number;
  bmi?: number;
  createdAt: string;
  updatedAt: string;
}

export interface VitalLog {
  id: string;
  patientId: string;
  temperatureCelsius?: number;
  bloodPressureSystolic?: number;
  bloodPressureDiastolic?: number;
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  weightKg?: number;
  heightCm?: number;
  notes?: string;
  recordedAt: string;
  recordedBy?: string;
}

export interface Admission {
  id: string;
  patientId: string;
  admissionDate: string;
  dischargeDate?: string;
  reason: string;
  admissionType: string;
  status: string;
  patient?: Patient;
}

export interface Ward {
  id: string;
  name: string;
  code: string;
  wardType: string;
  floor: number;
  capacity: number;
}

export interface Room {
  id: string;
  wardId: string;
  roomNumber: string;
  roomType: string;
  dailyRate: number;
  ward?: Ward;
}

export interface Bed {
  id: string;
  roomId: string;
  bedNumber: string;
  status: 'AVAILABLE' | 'OCCUPIED' | 'MAINTENANCE' | 'CLEANING';
  room?: Room;
}

export interface BedAssignment {
  id: string;
  admissionId: string;
  bedId: string;
  assignedAt: string;
  dischargedAt?: string;
  notes?: string;
  admission?: Admission;
  bed?: Bed;
}