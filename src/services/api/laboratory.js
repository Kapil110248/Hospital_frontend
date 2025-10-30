import { supabase } from '../../lib/supabase';

export const laboratoryApi = {
  async getAllOrders() {
    const { data, error } = await supabase
      .from('lab_orders')
      .select(`
        *,
        patient:patients(first_name, last_name),
        doctor:staff!lab_orders_doctor_id_fkey(first_name, last_name),
        test:laboratory_tests(name, code)
      `)
      .order('ordered_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrderById(id) {
    const { data, error } = await supabase
      .from('lab_orders')
      .select(`
        *,
        patient:patients(*),
        doctor:staff!lab_orders_doctor_id_fkey(*),
        test:laboratory_tests(*),
        results:lab_results(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateOrderStatus(id, status) {
    const { data, error } = await supabase
      .from('lab_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getAllTests() {
    const { data, error } = await supabase
      .from('laboratory_tests')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) throw error;
    return data;
  },
};
