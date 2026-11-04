import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dcpomddzvjmwvnovxvhb.supabase.co';
const SUPABASE_ANON_KEY = '여기에_복사한_anon_public_키_붙여넣기';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
