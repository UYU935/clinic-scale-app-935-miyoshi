import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// 接続情報がない場合はnull（保存なしモードで動作）
export const supabase: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: false,
        },
        global: {
          headers: {
            'X-Client-Info': 'digital-health-clinic/1.0',
          },
        },
      })
    : null;

// サービスロールキーはフロントエンドに置かない（絶対禁止）
// p9_alertsへのINSERTはSupabase Edge Function経由で行う
