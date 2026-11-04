import { createClient } from '@supabase/supabase-js';

// .trim()을 추가하여 복사 과정에서 들어간 보이지 않는 줄바꿈이나 공백을 원천 차단합니다.
const SUPABASE_URL = 'https://dcpomddzvjmwvnovxvhb.supabase.co'.trim();
const SUPABASE_ANON_KEY = '본인의_SUPABASE_ANON_KEY를_여기에_붙여넣으세요'.trim();

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
