import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dcpomddzvjmwvnovxvhb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjcG9tZGR6dmptd3Zub3Z4dmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODU0NDMsImV4cCI6MjA1NTk2MTQ0M30.실제당신의키';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
