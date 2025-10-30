import { supabase } from '../../lib/supabase';

export const radiologyApi = {
  async getAllOrders() {
    const { data, error } = await supabase
      .from('radiology_orders')
      .select(`
        *,
        patient:patients(first_name, last_name),
        doctor:staff!radiology_orders_doctor_id_fkey(first_name, last_name)
      `)
      .order('ordered_date', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getOrderById(id) {
    const { data, error } = await supabase
      .from('radiology_orders')
      .select(`
        *,
        patient:patients(*),
        doctor:staff!radiology_orders_doctor_id_fkey(*),
        reports:radiology_reports(*)
      `)
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data;
  },

  async updateOrderStatus(id, status) {
    const { data, error } = await supabase
      .from('radiology_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
