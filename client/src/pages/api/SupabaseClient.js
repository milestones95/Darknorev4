require("dotenv").config();
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://bcghywrjwhnnkzdozmvt.supabase.co"
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJjZ2h5d3Jqd2hubmt6ZG96bXZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDE4NDUwNjMsImV4cCI6MjAxNzQyMTA2M30.agnusJdlIPXjP9La_6lcOruf5NeS0y2izrLY8VaQhhc'
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
