import { supabase, DEMO_MODE } from '../../lib/supabase';

const MOCK_PATIENTS = [
  {
    id: '1',
    upid: 'P1001',
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1980-01-15',
    gender: 'MALE',
    phone: '+1234567890',
    email: 'john.doe@email.com',
    address: '123 Main St, City',
    status: 'OPD',
    bloodGroup: 'O+',
    allergies: 'None',
  },
  {
    id: '2',
    upid: 'P1002',
    firstName: 'Jane',
    lastName: 'Smith',
    dateOfBirth: '1992-05-20',
    gender: 'FEMALE',
    phone: '+1234567891',
    email: 'jane.smith@email.com',
    address: '456 Oak Ave, City',
    status: 'IPD',
    bloodGroup: 'A+',
    allergies: 'Penicillin',
  },
];

export async function getPatients(limit = 100) {
  try {
    if (DEMO_MODE) {
      return Promise.resolve(MOCK_PATIENTS);
    }

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching patients:', error);
    return MOCK_PATIENTS;
  }
}

export async function getPatientById(id) {
  try {
    if (DEMO_MODE) {
      return MOCK_PATIENTS.find(p => p.id === id) || null;
    }

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching patient:', error);
    return MOCK_PATIENTS.find(p => p.id === id) || null;
  }
}

export async function searchPatients(query) {
  try {
    if (DEMO_MODE) {
      const lowerQuery = query.toLowerCase();
      return MOCK_PATIENTS.filter(p =>
        p.firstName.toLowerCase().includes(lowerQuery) ||
        p.lastName.toLowerCase().includes(lowerQuery) ||
        p.upid.toLowerCase().includes(lowerQuery) ||
        p.phone.includes(query)
      );
    }

    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,upid.ilike.%${query}%,phone.ilike.%${query}%`)
      .limit(50);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error searching patients:', error);
    return [];
  }
}

export async function createPatient(patient) {
  try {
    if (DEMO_MODE) {
      const newPatient = {
        id: `${Date.now()}`,
        ...patient,
        upid: patient.upid || `P${Date.now().toString().slice(-6)}`,
      };
      return Promise.resolve(newPatient);
    }

    const upid = patient.upid || `P${Date.now().toString().slice(-6)}`;

    const { data, error } = await supabase
      .from('patients')
      .insert([{
        ...patient,
        upid,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating patient:', error);
    throw error;
  }
}

export async function updatePatient(id, updates) {
  try {
    if (DEMO_MODE) {
      const patient = MOCK_PATIENTS.find(p => p.id === id);
      if (!patient) throw new Error('Patient not found');
      return Promise.resolve({ ...patient, ...updates });
    }

    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating patient:', error);
    throw error;
  }
}

export const patientsApi = {
  getAll: getPatients,
  getById: getPatientById,
  search: searchPatients,
  create: createPatient,
  update: updatePatient,
};
