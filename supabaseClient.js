import { createClient } from '@supabase/supabase-js';

// URL과 Key에 혹시 모를 보이지 않는 문자나 따옴표 오류를 원천 차단하는 안전 장치
const rawUrl = 'https://dcpomddzvjmwvnovxvhb.supabase.co';
const rawKey = '본인의_SUPABASE_ANON_KEY를_여기에_붙여넣으세요';

// 공백, 따옴표, 개행문자 등 헤더 에러 유발 문자를 정규식으로 모두 제거
const SUPABASE_URL = rawUrl.trim().replace(/['"\n\r\t]/g, '');
const SUPABASE_ANON_KEY = rawKey.trim().replace(/['"\n\r\t]/g, '');

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
