import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    'https://jqegzheqmiqqxetrzypd.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpxZWd6aGVxbWlxcXhldHJ6eXBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA1ODYzNTIsImV4cCI6MjAxNjE2MjM1Mn0.LYZcPS9XUfVVC2JpV96BeZmw8ay_N9xoMhtcmIUWw6Q');

module.exports = supabase;
