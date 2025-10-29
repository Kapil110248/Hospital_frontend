import { supabase } from '../../lib/supabase';

export interface LabOrder {
  id: string;
  order_number: string;
  patient_id: string;
  doctor_id: string;
  test_id: string;
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
  test?: {
    name: string;
    code: string;
  };
}

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

  async getOrderById(id: string) {
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

  async updateOrderStatus(id: string, status: string) {
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
