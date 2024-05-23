import { createClient } from '@supabase/supabase-js';
import config from '../config';

function createSupabaseClient() {
  return createClient(config.db.supabaseUrl, config.db.supabaseAnonKey);
}

export const SBclient = createSupabaseClient();
