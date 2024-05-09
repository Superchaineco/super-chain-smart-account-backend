import { config } from 'dotenv';

config();

export default {
  db: {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY!,
  },
};
