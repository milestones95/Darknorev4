require("dotenv").config();
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://kavgcvgpozexdahcihzl.supabase.co"
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthdmdjdmdwb3pleGRhaGNpaHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4NzMxODEsImV4cCI6MjAzMzQ0OTE4MX0.U6-vAo3om50zpieWZ2V-RdM_YnAZgiu0RXwNY1ku0nk'
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
