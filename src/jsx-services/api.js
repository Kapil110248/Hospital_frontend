import { supabase } from './supabase';

// Authentication Services
export const authService = {
  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  },

  async signUp(email, password, userData) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });
    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(event, session);
    });
  },
};

// Patient Services
export const patientService = {
  async getAll() {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(patientData) {
    const { data, error } = await supabase
      .from('patients')
      .insert([patientData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, patientData) {
    const { data, error } = await supabase
      .from('patients')
      .update(patientData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('patients')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async search(searchTerm) {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,upid.ilike.%${searchTerm}%`)
      .limit(20);
    if (error) throw error;
    return data;
  },
};

// Appointment Services
export const appointmentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(*),
        doctor:staff(*)
      `)
      .order('scheduled_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(*),
        doctor:staff(*)
      `)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(appointmentData) {
    const { data, error } = await supabase
      .from('appointments')
      .insert([appointmentData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, appointmentData) {
    const { data, error } = await supabase
      .from('appointments')
      .update(appointmentData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async getTodayAppointments() {
    const today = new Date().toISOString().split('T')[0];
    const { data, error } = await supabase
      .from('appointments')
      .select(`
        *,
        patient:patients(*),
        doctor:staff(*)
      `)
      .gte('scheduled_at', `${today}T00:00:00`)
      .lte('scheduled_at', `${today}T23:59:59`)
      .order('scheduled_at', { ascending: true });
    if (error) throw error;
    return data;
  },
};

// Staff Services
export const staffService = {
  async getAll() {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getDoctors() {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .in('role', ['DOCTOR'])
      .eq('is_active', true)
      .order('first_name', { ascending: true});
    if (error) throw error;
    return data;
  },

  async create(staffData) {
    const { data, error } = await supabase
      .from('staff')
      .insert([staffData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, staffData) {
    const { data, error } = await supabase
      .from('staff')
      .update(staffData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Department Services
export const departmentService = {
  async getAll() {
    const { data, error } = await supabase
      .from('departments')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  },
};

// Prescription Services
export const prescriptionService = {
  async getAll() {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        patient:patients(*),
        doctor:staff(*)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        patient:patients(*),
        doctor:staff(*)
      `)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async getByPatient(patientId) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        patient:patients(*),
        doctor:staff(*)
      `)
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(prescriptionData) {
    const { data, error } = await supabase
      .from('prescriptions')
      .insert([prescriptionData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, prescriptionData) {
    const { data, error } = await supabase
      .from('prescriptions')
      .update(prescriptionData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('prescriptions')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Lab Order Services
export const labService = {
  async getAll() {
    const { data, error} = await supabase
      .from('lab_orders')
      .select(`
        *,
        patient:patients(*),
        doctor:staff(*)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('lab_orders')
      .select(`
        *,
        patient:patients(*),
        doctor:staff(*)
      `)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(labOrderData) {
    const { data, error } = await supabase
      .from('lab_orders')
      .insert([labOrderData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, labOrderData) {
    const { data, error } = await supabase
      .from('lab_orders')
      .update(labOrderData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('lab_orders')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Radiology Order Services
export const radiologyService = {
  async getAll() {
    const { data, error } = await supabase
      .from('radiology_orders')
      .select(`
        *,
        patient:patients(*),
        doctor:staff(*)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('radiology_orders')
      .select(`
        *,
        patient:patients(*),
        doctor:staff(*)
      `)
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(radiologyOrderData) {
    const { data, error } = await supabase
      .from('radiology_orders')
      .insert([radiologyOrderData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, radiologyOrderData) {
    const { data, error } = await supabase
      .from('radiology_orders')
      .update(radiologyOrderData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('radiology_orders')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },
};

// Medicine Services
export const medicineService = {
  async getAll() {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('name', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  async create(medicineData) {
    const { data, error } = await supabase
      .from('medicines')
      .insert([medicineData])
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, medicineData) {
    const { data, error } = await supabase
      .from('medicines')
      .update(medicineData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);
    if (error) throw error;
  },

  async getLowStock() {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .filter('stock_quantity', 'lte', 'reorder_level')
      .eq('is_active', true)
      .order('stock_quantity', { ascending: true });
    if (error) throw error;
    return data;
  },
};

// Dashboard Stats
export const dashboardService = {
  async getStats() {
    const [patients, staff, appointments] = await Promise.all([
      supabase.from('patients').select('*', { count: 'exact', head: true }),
      supabase.from('staff').select('*', { count: 'exact', head: true }),
      appointmentService.getTodayAppointments(),
    ]);

    return {
      totalPatients: patients.count || 0,
      totalStaff: staff.count || 0,
      todayAppointments: appointments?.length || 0,
    };
  },
};
