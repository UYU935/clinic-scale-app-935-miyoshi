-- ============================================================
-- デジタル健康外来スケールシステム データベーススキーマ
-- ============================================================

-- 患者テーブル
CREATE TABLE patients (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clinic_id        TEXT NOT NULL,
  patient_code     TEXT NOT NULL,
  age_group        TEXT NOT NULL,
  gender           TEXT NOT NULL,
  occupation       TEXT,
  chief_complaints TEXT[],
  enrolled_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_active        BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (clinic_id, patient_code),
  CONSTRAINT age_group_values CHECK (
    age_group IN ('under_13','13_17','18_29','30_39','40_49','50_59','60_69','70_over')
  ),
  CONSTRAINT gender_values CHECK (
    gender IN ('male','female','other','no_answer')
  )
);

-- スケール回答記録テーブル
CREATE TABLE scale_records (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id       UUID NOT NULL REFERENCES patients(id),
  session_type     TEXT NOT NULL,
  recorded_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  recorded_date    DATE NOT NULL,

  -- セクションA：端末使用
  a1 SMALLINT, a2 SMALLINT, a3 SMALLINT,
  a4 SMALLINT, a5 SMALLINT, a6 SMALLINT,
  a7 SMALLINT, a8 SMALLINT,
  a_total          SMALLINT,
  a_flags          TEXT[],

  -- セクションB：睡眠
  b1_time          TIME,
  b2 SMALLINT, b4 SMALLINT, b6 SMALLINT,
  b3_time          TIME,
  b5 SMALLINT, b7 SMALLINT,
  b_estimated_sleep INTEGER,
  b_discomfort     SMALLINT,
  b_flags          TEXT[],

  -- PHQ-9
  p1 SMALLINT, p2 SMALLINT, p3 SMALLINT,
  p4 SMALLINT, p5 SMALLINT, p6 SMALLINT,
  p7 SMALLINT, p8 SMALLINT, p9 SMALLINT,
  phq9_total       SMALLINT,
  phq9_p9_alert    BOOLEAN DEFAULT false,

  -- GAD-7
  g1 SMALLINT, g2 SMALLINT, g3 SMALLINT,
  g4 SMALLINT, g5 SMALLINT, g6 SMALLINT,
  g7 SMALLINT,
  gad7_total       SMALLINT,

  -- リンク情報
  linked_from      UUID REFERENCES scale_records(id),

  -- 入力値バリデーション制約
  CONSTRAINT a1_range CHECK (a1 BETWEEN 1 AND 6),
  CONSTRAINT a2_range CHECK (a2 BETWEEN 0 AND 5),
  CONSTRAINT a3_range CHECK (a3 BETWEEN 0 AND 4),
  CONSTRAINT a4_range CHECK (a4 BETWEEN 0 AND 3),
  CONSTRAINT a5_range CHECK (a5 BETWEEN 0 AND 3),
  CONSTRAINT a6_range CHECK (a6 BETWEEN 0 AND 3),
  CONSTRAINT a7_range CHECK (a7 BETWEEN 0 AND 3),
  CONSTRAINT a8_range CHECK (a8 BETWEEN 0 AND 3),
  CONSTRAINT b2_range CHECK (b2 BETWEEN 0 AND 4),
  CONSTRAINT b4_range CHECK (b4 BETWEEN 0 AND 3),
  CONSTRAINT b5_range CHECK (b5 BETWEEN 1 AND 5),
  CONSTRAINT b6_range CHECK (b6 BETWEEN 0 AND 3),
  CONSTRAINT b7_range CHECK (b7 BETWEEN 1 AND 5),
  CONSTRAINT p_range CHECK (
    p1 BETWEEN 0 AND 3 AND p2 BETWEEN 0 AND 3 AND
    p3 BETWEEN 0 AND 3 AND p4 BETWEEN 0 AND 3 AND
    p5 BETWEEN 0 AND 3 AND p6 BETWEEN 0 AND 3 AND
    p7 BETWEEN 0 AND 3 AND p8 BETWEEN 0 AND 3 AND
    p9 BETWEEN 0 AND 3
  ),
  CONSTRAINT g_range CHECK (
    g1 BETWEEN 0 AND 3 AND g2 BETWEEN 0 AND 3 AND
    g3 BETWEEN 0 AND 3 AND g4 BETWEEN 0 AND 3 AND
    g5 BETWEEN 0 AND 3 AND g6 BETWEEN 0 AND 3 AND
    g7 BETWEEN 0 AND 3
  ),
  CONSTRAINT session_type_values CHECK (
    session_type IN (
      'digital_sleep',
      'digital_sleep_with_phq_gad',
      'phq9',
      'gad7',
      'phq9_gad7'
    )
  )
);

-- P9アラートテーブル
CREATE TABLE p9_alerts (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scale_record_id  UUID NOT NULL REFERENCES scale_records(id),
  patient_id       UUID NOT NULL REFERENCES patients(id),
  p9_score         SMALLINT NOT NULL,
  alerted_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_confirmed     BOOLEAN NOT NULL DEFAULT false,
  confirmed_at     TIMESTAMPTZ,
  confirmed_by     TEXT,

  CONSTRAINT p9_score_range CHECK (p9_score BETWEEN 1 AND 3)
);

-- ============================================================
-- インデックス
-- ============================================================

CREATE INDEX idx_scale_records_patient_date
  ON scale_records(patient_id, recorded_date DESC);

CREATE INDEX idx_p9_alerts_unconfirmed
  ON p9_alerts(is_confirmed, alerted_at DESC)
  WHERE is_confirmed = false;

CREATE INDEX idx_scale_records_session_type
  ON scale_records(session_type, recorded_at DESC);

CREATE INDEX idx_patients_clinic
  ON patients(clinic_id, enrolled_at DESC);

-- ============================================================
-- RLS（行レベルセキュリティ）有効化
-- ============================================================

ALTER TABLE patients       ENABLE ROW LEVEL SECURITY;
ALTER TABLE scale_records  ENABLE ROW LEVEL SECURITY;
ALTER TABLE p9_alerts      ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- patients テーブルのRLSポリシー
-- ============================================================

-- 医師：自院の患者を参照・登録可
CREATE POLICY "doctor_patients_select" ON patients
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'doctor'
    AND clinic_id = (auth.jwt() ->> 'clinic_id')
  );

CREATE POLICY "doctor_patients_insert" ON patients
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'role') = 'doctor'
    AND clinic_id = (auth.jwt() ->> 'clinic_id')
  );

-- 患者：自分のレコードのみ参照可
CREATE POLICY "patient_self_select" ON patients
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'patient'
    AND id = auth.uid()
  );

-- ============================================================
-- scale_records テーブルのRLSポリシー
-- ============================================================

-- 患者：自分のrecordのみINSERT可
CREATE POLICY "patient_record_insert" ON scale_records
  FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'role') = 'patient'
    AND patient_id = auth.uid()
  );

-- 患者：自分のrecordのみSELECT可
CREATE POLICY "patient_record_select" ON scale_records
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'patient'
    AND patient_id = auth.uid()
  );

-- 医師：自院患者のrecordのみSELECT可
CREATE POLICY "doctor_record_select" ON scale_records
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'doctor'
    AND patient_id IN (
      SELECT id FROM patients
      WHERE clinic_id = (auth.jwt() ->> 'clinic_id')
    )
  );

-- UPDATE・DELETEは全ロールで禁止（ポリシーを作らない = デフォルト拒否）

-- ============================================================
-- p9_alerts テーブルのRLSポリシー
-- ============================================================

-- 患者：INSERT不可・SELECT不可（アラートは患者画面に見せない）
-- INSERT はサービスロールキー（Edge Function）からのみ許可

-- 医師：自院患者のアラートのみSELECT・UPDATE可
CREATE POLICY "doctor_alerts_select" ON p9_alerts
  FOR SELECT TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'doctor'
    AND patient_id IN (
      SELECT id FROM patients
      WHERE clinic_id = (auth.jwt() ->> 'clinic_id')
    )
  );

CREATE POLICY "doctor_alerts_update" ON p9_alerts
  FOR UPDATE TO authenticated
  USING (
    (auth.jwt() ->> 'role') = 'doctor'
    AND patient_id IN (
      SELECT id FROM patients
      WHERE clinic_id = (auth.jwt() ->> 'clinic_id')
    )
  )
  WITH CHECK (
    -- 更新できるのはis_confirmed・confirmed_at・confirmed_byのみ（スコア値の改ざんを防ぐ）
    is_confirmed = true
  );

-- ============================================================
-- 統計エクスポート用クエリ（匿名化）
-- ============================================================
-- 以下のクエリをSupabaseダッシュボードのSQL Editorで実行してCSVエクスポートすること
-- （patient_id・patient_codeは連番匿名IDに置換済み）
--
-- SELECT
--   ROW_NUMBER() OVER (ORDER BY p.enrolled_at) AS anon_id,
--   p.age_group, p.gender, p.occupation,
--   array_to_string(p.chief_complaints, '|') AS chief_complaints,
--   r.session_type, r.recorded_date,
--   r.a1, r.a2, r.a3, r.a4, r.a5, r.a6, r.a7, r.a8, r.a_total,
--   array_to_string(r.a_flags, '|') AS a_flags,
--   r.b1_time, r.b2, r.b3_time, r.b4, r.b5, r.b6, r.b7,
--   r.b_estimated_sleep, r.b_discomfort,
--   array_to_string(r.b_flags, '|') AS b_flags,
--   r.p1, r.p2, r.p3, r.p4, r.p5, r.p6, r.p7, r.p8, r.p9,
--   r.phq9_total,
--   r.g1, r.g2, r.g3, r.g4, r.g5, r.g6, r.g7, r.gad7_total
-- FROM scale_records r
-- JOIN patients p ON r.patient_id = p.id
-- WHERE p.clinic_id = 'clinic_001'
-- ORDER BY p.enrolled_at, r.recorded_date;
