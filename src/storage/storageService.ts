import { supabase } from './supabaseClient';
import type { ScaleRecordInput } from './types';

export const isStorageEnabled: boolean =
  import.meta.env.VITE_ENABLE_STORAGE === 'true' && supabase !== null;

export async function saveScaleRecord(
  record: ScaleRecordInput
): Promise<{ ok: boolean; id: string | null }> {
  if (!isStorageEnabled || !supabase) return { ok: true, id: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: true, id: null };

  const { data, error } = await supabase
    .from('scale_records')
    .insert({ ...record, patient_id: user.id })
    .select('id')
    .single();

  if (error) {
    // ストレージエラーはサイレントに処理（アプリの動作は継続）
    return { ok: false, id: null };
  }
  return { ok: true, id: data.id };
}

export async function triggerP9Alert(recordId: string, p9Score: number): Promise<void> {
  if (!isStorageEnabled || !supabase) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.functions.invoke('create-p9-alert', {
    body: { record_id: recordId, p9_score: p9Score },
  });
}
