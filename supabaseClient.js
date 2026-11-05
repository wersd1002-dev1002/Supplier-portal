import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dcpomddzvjmwvnovxvhb.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjcG9tZGR6dmptd3Zub3Z4dmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM3NzM4MDAsImV4cCI6MjEwOTM0OTgwMH0.RnKErd4zm25Jwr86rxHDcEX66XTpKoZqiIeha41zM-I'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
