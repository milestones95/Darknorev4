import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://kavgcvgpozexdahcihzl.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imthdmdjdmdwb3pleGRhaGNpaHpsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTc4NzMxODEsImV4cCI6MjAzMzQ0OTE4MX0.U6-vAo3om50zpieWZ2V-RdM_YnAZgiu0RXwNY1ku0nk');

module.exports = supabase;
