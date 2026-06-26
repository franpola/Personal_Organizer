import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://pnvcxkymqfoemynftfkj.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBudmN4a3ltcWZvZW15bmZ0ZmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0ODgxOTAsImV4cCI6MjA5ODA2NDE5MH0.GoaavOzbmQ47SZcM6JLAZDFc8EGFZC3pV8e5qF_4TYY'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
