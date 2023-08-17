require("dotenv").config();
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://abniisbhpxstkyezeosc.supabase.co"
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFibmlpc2JocHhzdGt5ZXplb3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODcwMTkyMDAsImV4cCI6MjAwMjU5NTIwMH0.Xa3VzYTd0V5-p5IqzjKGcUH0y-iFBzrYxgAqNmqC2dM'
// const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
// console.log("🚀 ~ file: SupabaseClient.js:6 ~ SUPABASE_URL:", SUPABASE_URL)
// const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY
// console.log("🚀 ~ file: SupabaseClient.js:8 ~ SUPABASE_KEY:", SUPABASE_KEY)
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
