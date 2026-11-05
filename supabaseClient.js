import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://dcpomddzvjmwvnovxvhb.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_ttujjxibztw75TjS-Dwcg_B7zjw...'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
