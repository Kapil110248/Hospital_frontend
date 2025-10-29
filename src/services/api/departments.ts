import { supabase } from '../../lib/supabase';
import { Department } from '../../types';

export async function getDepartments() {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return data as Department[];
}

export async function getDepartmentById(id: string) {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (error) throw error;
  return data as Department | null;
}

export async function createDepartment(department: Omit<Department, 'id' | 'createdAt' | 'updatedAt'>) {
  const { data, error } = await supabase
    .from('departments')
    .insert([department])
    .select()
    .single();

  if (error) throw error;
  return data as Department;
}
