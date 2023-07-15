import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://abniisbhpxstkyezeosc.supabase.co"
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFibmlpc2JocHhzdGt5ZXplb3NjIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODcwMTkyMDAsImV4cCI6MjAwMjU5NTIwMH0.Xa3VzYTd0V5-p5IqzjKGcUH0y-iFBzrYxgAqNmqC2dM'

module.exports = createClient(SUPABASE_URL, SUPABASE_KEY);