import { supabase } from '../../lib/supabase';

export interface RadiologyOrder {
  id: string;
  order_number: string;
  patient_id: string;
  doctor_id: string;
  imaging_type: string;
  body_part: string;
  ordered_date: string;
  status: string;
  priority: string;
  patient?: {
    first_name: string;
    last_name: string;
  };
  doctor?: {
    first_name: string;
    last_name: string;
  };
}

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

  async getOrderById(id: string) {
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

  async updateOrderStatus(id: string, status: string) {
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
