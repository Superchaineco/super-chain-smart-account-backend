export default {
  db: {
    supabaseUrl: process.env.SUPABASE_URL!,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY!,
  },
  constants: {
    SEPOLIA_CHAIN_ID: 11155111,
    OPTIMISM_CHAIN_ID: 10,
  }
};
