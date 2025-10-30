import { supabase } from '../../lib/supabase';

export const prescriptionsApi = {
  async getAll() {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        patient:patients(first_name, last_name),
        doctor:staff!prescriptions_doctor_id_fkey(first_name, last_name)
      `)
      .order('prescribed_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('prescriptions')
      .select(`
        *,
        patient:patients(*),
        doctor:staff!prescriptions_doctor_id_fkey(*),
        prescription_items(
          *,
          medicine:medicines(*)
        )
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateStatus(id, status) {
    const { data, error } = await supabase
      .from('prescriptions')
      .update({
        status,
        dispensed_date: status === 'DISPENSED' ? new Date().toISOString() : null
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
