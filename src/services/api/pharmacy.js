import { supabase } from '../../lib/supabase';

export const pharmacyApi = {
  async getAllMedicines() {
    const { data, error } = await supabase
      .from('medicines')
      .select(`
        *,
        batches:medicine_batches(*)
      `)
      .order('name');

    if (error) throw error;
    return data;
  },

  async getMedicineById(id) {
    const { data, error } = await supabase
      .from('medicines')
      .select(`
        *,
        batches:medicine_batches(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async createMedicine(medicine) {
    const { data, error } = await supabase
      .from('medicines')
      .insert(medicine)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMedicine(id, updates) {
    const { data, error } = await supabase
      .from('medicines')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
