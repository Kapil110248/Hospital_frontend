import { supabase } from '../../lib/supabase';

export interface Staff {
  id: string;
  employee_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  address: string;
  is_active: boolean;
  user?: {
    email: string;
    role: string;
  };
  department?: {
    name: string;
  };
  specialization?: {
    name: string;
  };
}

export const staffApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('staff')
      .select(`
        *,
        user:users(email, role),
        department:departments(name),
        specialization:specializations(name)
      `)
      .order('first_name');

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('staff')
      .select(`
        *,
        user:users(*),
        department:departments(*),
        specialization:specializations(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Staff>) {
    const { data, error } = await supabase
      .from('staff')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
