import { supabase } from '../../lib/supabase';

export interface Medicine {
  id: string;
  name: string;
  generic_name: string;
  manufacturer: string;
  category: string;
  unit: string;
  reorder_level: number;
  is_active: boolean;
  batches?: MedicineBatch[];
}

export interface MedicineBatch {
  id: string;
  medicine_id: string;
  batch_number: string;
  quantity: number;
  unit_price: number;
  selling_price: number;
  expiry_date: string;
  is_active: boolean;
}

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

  async getMedicineById(id: string) {
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

  async createMedicine(medicine: Partial<Medicine>) {
    const { data, error } = await supabase
      .from('medicines')
      .insert(medicine)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateMedicine(id: string, updates: Partial<Medicine>) {
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
