import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dcpomddzvjmwvnovxvhb.supabase.co'.trim();
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjcG9tZGR6dmptd3Zub3Z4dmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODU0NDMsImV4cCI6MjA1NTk2MTQ0M30.실제당신의애넌키_여기에입력'.trim();

// 브라우저 헤더 에러(non ISO-8859-1 code point)를 방지하기 위해 
// 전역 커스텀 헤더 설정을 제거하고 기본값으로 안전하게 생성합니다.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});
