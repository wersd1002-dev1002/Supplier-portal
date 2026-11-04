import { createClient } from '@supabase/supabase-js';

// 공백, 따옴표, 줄바꿈을 완벽하게 제거하는 안전한 초기화 방식
const supabaseUrl = 'https://dcpomddzvjmwvnovxvhb.supabase.co'.trim();
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjcG9tZGR6dmptd3Zub3Z4dmhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAzODU0NDMsImV4cCI6MjA1NTk2MTQ0M30.실제당신의애넌키_여기에입력'.trim();

export const supabase = createClient(supabaseUrl, supabaseKey);
