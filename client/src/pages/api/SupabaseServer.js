require("dotenv").config();
import { createClient } from '@supabase/supabase-js'

console.log("🚀 ~ file: SupabaseServer.js:5 ~ (process.env.SUPABASE_URL:", process.env, process.env.SUPABASE_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

module.exports = supabase;
