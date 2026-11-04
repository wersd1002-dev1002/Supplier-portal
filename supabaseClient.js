import { createClient } from '@supabase/supabase-js';

// URL과 Key에 공백이나 한글 주석이 섞이지 않도록 주의하세요.
const SUPABASE_URL = 'https://dcpomddzvjmwvnovxvhb.supabase.co';
const SUPABASE_ANON_KEY = '여기에_복사한_anon_public_키만_정확히_붙여넣기';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
