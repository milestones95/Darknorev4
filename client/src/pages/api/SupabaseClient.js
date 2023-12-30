require("dotenv").config();
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://jqegzheqmiqqxetrzypd.supabase.co"
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZWd6aGVxbWlxcXhldHJ6eXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA1ODYzNTIsImV4cCI6MjAxNjE2MjM1Mn0.LYZcPS9XUfVVC2JpV96BeZmw8ay_N9xoMhtcmIUWw6Q'
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
