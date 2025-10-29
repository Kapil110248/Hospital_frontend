# Hospital Management System - JSX Version

## Project Structure

```
src/
├── jsx-components/          # All React JSX Components
│   ├── auth/               # Authentication components
│   │   └── Login.jsx
│   ├── common/             # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── DataTable.jsx
│   │   └── Modal.jsx
│   ├── forms/              # Form components
│   │   └── PatientRegistrationForm.jsx
│   ├── layouts/            # Layout components
│   │   ├── DashboardLayout.jsx
│   │   ├── Sidebar.jsx
│   │   └── TopBar.jsx
│   └── pages/              # Page components
│       ├── dashboard/
│       │   └── Dashboard.jsx
│       └── patient/
│           └── PatientList.jsx
├── jsx-context/            # React Context providers
│   └── AuthContext.jsx
├── jsx-services/           # API services
│   ├── api.js
│   └── supabase.js
├── jsx-utils/              # Utility functions and constants
│   └── constants.js
├── AppJSX.jsx             # Main JSX App component
└── main-jsx.jsx           # JSX entry point
```

## Technology Stack

- **React** (JavaScript/JSX)
- **React Router** v6 - Navigation and routing
- **Bootstrap** 5 - CSS framework
- **React-Bootstrap** - Bootstrap components for React
- **Tailwind CSS** - Utility-first CSS
- **Supabase** - Backend and database
- **Lucide React** - Icon library
- **Vite** - Build tool

## Key Features Implemented

### 1. Authentication System
- Login page with form validation
- Auth context for global state management
- Protected routes
- Session management with Supabase

### 2. Dashboard
- Stats cards with key metrics
- Today's appointments table
- Quick stats sidebar
- Recent activities feed

### 3. Patient Management
- Complete patient registration form with 3 tabs:
  - Basic Information
  - Medical Information
  - Insurance & Emergency
- Patient list with search and pagination
- Edit patient functionality
- Data table with sorting and filtering

### 4. Layout Components
- Responsive sidebar navigation
- Top navigation bar with search
- Dashboard layout wrapper

### 5. Common Components
- **Button** - Customizable button with loading state
- **Card** - Card component with header/body
- **StatsCard** - Statistics display card
- **Modal** - Modal dialog with custom content
- **DataTable** - Feature-rich data table with pagination

## Naming Conventions

### Files
- **Components**: PascalCase (e.g., `PatientList.jsx`, `DashboardLayout.jsx`)
- **Services**: camelCase (e.g., `api.js`, `supabase.js`)
- **Utils**: camelCase (e.g., `constants.js`, `helpers.js`)

### Components
- **Functional Components**: PascalCase
- **Props**: camelCase
- **State Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE

## Bootstrap + Tailwind CSS Usage

### Bootstrap Classes Used
- Layout: `container`, `row`, `col`, `d-flex`, `flex-column`
- Spacing: `mb-3`, `mt-4`, `p-3`, `gap-3`
- Typography: `fw-bold`, `text-muted`, `fs-4`
- Components: `btn`, `card`, `table`, `modal`, `nav`, `badge`
- Utilities: `bg-light`, `border`, `rounded`, `shadow`

### Tailwind CSS Classes Used
- Layout: `min-vh-100`, `flex-grow-1`
- Colors: Custom color schemes
- Hover effects: `hover:bg-secondary`
- Custom utilities combined with Bootstrap

## Component Props Pattern

```jsx
// Example: Button Component
<Button
  variant="primary"      // Bootstrap variant
  size="md"             // sm, md, lg
  loading={false}       // Shows spinner
  disabled={false}      // Disabled state
  onClick={handler}     // Click handler
>
  Button Text
</Button>

// Example: DataTable Component
<DataTable
  columns={columns}     // Array of column definitions
  data={data}          // Array of data objects
  loading={false}      // Loading state
  searchable={true}    // Enable search
  pageSize={10}        // Items per page
  onRowClick={handler} // Row click handler
/>
```

## API Service Pattern

```javascript
// All services use async/await
const data = await patientService.getAll();
const patient = await patientService.getById(id);
const newPatient = await patientService.create(data);
const updated = await patientService.update(id, data);
await patientService.delete(id);
```

## Form Handling Pattern

```jsx
const [formData, setFormData] = useState({});

const handleChange = (e) => {
  setFormData(prev => ({
    ...prev,
    [e.target.name]: e.target.value
  }));
};

const handleSubmit = async (e) => {
  e.preventDefault();
  // Process form
};
```

## Running the JSX Version

### Development
```bash
# Use the JSX HTML file
npm run dev
# Then open: http://localhost:5173/index-jsx.html
```

### Build
```bash
npm run build
```

## Environment Variables Required

Create a `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Next Steps to Expand

1. **Appointment Management**
   - Create appointment booking form
   - Appointment calendar view
   - Appointment status updates

2. **Staff Management**
   - Staff registration form
   - Staff list and details
   - Department assignment

3. **Laboratory Module**
   - Lab test orders
   - Test results entry
   - Report generation

4. **Pharmacy Module**
   - Medicine inventory
   - Prescription dispensing
   - Stock management

5. **Billing Module**
   - Invoice generation
   - Payment processing
   - Receipt printing

6. **Reports & Analytics**
   - Dashboard charts
   - Revenue reports
   - Patient statistics

## Code Style Guidelines

1. Use functional components with hooks
2. Keep components small and focused
3. Extract reusable logic into custom hooks
4. Use destructuring for props
5. Follow consistent naming conventions
6. Add PropTypes or comments for complex components
7. Keep file length manageable (< 300 lines)
8. Use meaningful variable names
9. Add error handling for async operations
10. Use Bootstrap classes first, Tailwind for custom styling

## Common Bootstrap Components Used

- **Forms**: `Form`, `Form.Control`, `Form.Label`, `Form.Select`
- **Layout**: `Container`, `Row`, `Col`
- **Navigation**: `Nav`, `Navbar`
- **Feedback**: `Alert`, `Badge`, `Spinner`
- **Components**: `Button`, `Card`, `Modal`, `Table`
- **Utilities**: Spacing, Colors, Typography, Flexbox

## Deployment

The JSX version can be deployed to:
- Vercel
- Netlify
- AWS Amplify
- Any static hosting service

Make sure to:
1. Set environment variables
2. Configure Supabase project
3. Update CORS settings if needed
4. Test authentication flow
