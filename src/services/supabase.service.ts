import { createClient } from '@supabase/supabase-js';
import config from '../config';

export function createSupabaseClient() {
  console.log('Creating Supabase client');
  return createClient(config.db.supabaseUrl, config.db.supabaseAnonKey);
}
