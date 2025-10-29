# Hospital Management System (HMS) Frontend

A production-ready, role-specific frontend dashboard system for Hospital Management built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

### Multi-Role Dashboard System
- **Admin Dashboard**: Complete system overview with metrics, department performance, and system alerts
- **Doctor Dashboard**: Today's appointments, patient EMR, prescriptions, lab orders, and commission tracking
- **Receptionist Dashboard**: Patient registration, appointment scheduling, check-in/check-out, and billing initiation
- Additional dashboards for Nurse, Pharmacist, Lab Tech, Radiologist, Finance, HR, Patient, and Auditor roles

### Design System
- **Theme**: Hospital light mode with translucent white + light purple (#A78BFA)
- **Glassmorphism**: Backdrop blur effects with soft shadows
- **Responsive**: Mobile-first design with breakpoints for tablet and desktop
- **Typography**: Inter for body text, Poppins for headings
- **Accessible**: WCAG compliant with proper contrast ratios

### Core Components
- **StatsCard**: Display key metrics with icons and trends
- **DataTable**: Reusable table component with sorting and filtering
- **Sidebar**: Role-based navigation menu
- **TopBar**: Global search, notifications, and user profile
- **Modal**: Flexible modal dialogs
- **Button**: Customizable button component with variants

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Supabase** - Backend and authentication
- **Lucide React** - Icon library
- **React Hook Form** - Form management
- **Axios** - HTTP client

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   │   ├── StatsCard.tsx
│   │   ├── DataTable.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TopBar.tsx
│   │   ├── Button.tsx
│   │   └── Modal.tsx
│   └── layouts/         # Layout components
│       └── DashboardLayout.tsx
├── pages/
│   ├── Login.tsx
│   └── dashboard/       # Role-specific dashboards
│       ├── AdminDashboard.tsx
│       ├── DoctorDashboard.tsx
│       └── ReceptionistDashboard.tsx
├── context/
│   └── AuthContext.tsx  # Authentication state
├── lib/
│   └── supabase.ts      # Supabase client
├── types/
│   └── index.ts         # TypeScript types
├── App.tsx              # Main app component
└── main.tsx             # Entry point
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account

### Installation

1. Install dependencies:
```bash
npm install
```

2. Environment variables are already configured in `.env`:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## User Roles & Access

### Role-Based Routing
Each user role gets access to specific features:

| Role | Dashboard Access | Key Features |
|------|-----------------|--------------|
| ADMIN | Full system access | User management, system configuration, audit logs |
| DOCTOR | Clinical workflows | Appointments, prescriptions, EMR, lab orders |
| NURSE | Patient care | Vitals, medications, bed assignments |
| RECEPTIONIST | Front desk | Registration, appointments, billing initiation |
| PHARMACIST | Pharmacy | Prescription fulfillment, inventory, stock management |
| LAB_TECH | Laboratory | Test processing, sample collection, results upload |
| RADIOLOGIST | Radiology | Imaging requests, report upload |
| FINANCE | Financial | Invoicing, payments, commission calculation |
| HR | Human Resources | Staff management, payroll, shifts |
| PATIENT | Patient portal | Appointments, medical records, billing |
| AUDITOR | Read-only | Compliance monitoring, audit logs |

## Authentication

The system uses Supabase authentication with JWT tokens. Users are automatically redirected based on their role after login.

### Demo Credentials
```
Email: admin@hospital.com
Password: admin123
```

## Data Models

Based on the Prisma schema, the system supports:

- **Users & Staff**: Role-based access control
- **Patients**: Demographics, medical history, insurance
- **Appointments**: Scheduling, queue management
- **Encounters**: Clinical consultations and EMR
- **Prescriptions**: E-prescribing with dispensation tracking
- **Laboratory**: Test orders, sample tracking, results
- **Radiology**: Imaging requests and reports
- **Pharmacy**: Medicine catalog, batch tracking, inventory
- **Billing**: Invoices, payments, insurance claims
- **Commission**: Automated calculation for doctors
- **Departments**: Organizational structure
- **Admissions**: Inpatient management with bed assignments

## Design Guidelines

### Colors
- **Primary**: Light Purple (#A78BFA)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Error**: Red (#ef4444)
- **Teal**: (#14b8a6)

### Components
All components follow these principles:
- Glassmorphism with `bg-white/60 backdrop-blur-md`
- Soft shadows for elevation
- Rounded corners (`rounded-xl`)
- Smooth transitions
- Hover states for interactive elements

## API Integration

The frontend is ready to connect to a Supabase backend. API services should be created in `src/services/api/` directory.

Example:
```typescript
// src/services/api/patients.ts
import { supabase } from '../../lib/supabase';

export async function getPatients() {
  const { data, error } = await supabase
    .from('patients')
    .select('*')
    .limit(100);

  if (error) throw error;
  return data;
}
```

## Next Steps

To complete the full HMS system:

1. **Database Setup**: Apply Prisma migrations to Supabase
2. **API Services**: Implement CRUD operations for all entities
3. **Additional Dashboards**: Complete remaining role dashboards (Nurse, Pharmacist, Lab Tech, etc.)
4. **Forms**: Build forms for patient registration, appointment booking, etc.
5. **Reports**: Add analytics and reporting features
6. **Real-time Updates**: Implement Supabase real-time subscriptions
7. **File Upload**: Handle medical images and documents
8. **Print Features**: PDF generation for reports and invoices

## Security

- JWT-based authentication
- Row Level Security (RLS) on all tables
- Role-based access control
- PHI data encryption
- Audit logging for compliance

## License

MIT

## Support

For issues and questions, please contact the development team.
