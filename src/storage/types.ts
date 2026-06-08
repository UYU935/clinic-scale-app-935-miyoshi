export type ScaleRecordInput = {
  session_type: string;
  recorded_date: string; // YYYY-MM-DD
  // セクションA
  a1?: number; a2?: number; a3?: number; a4?: number;
  a5?: number; a6?: number; a7?: number; a8?: number;
  a_total?: number;
  a_flags?: string[];
  // セクションB
  b1_time?: string; b2?: number; b3_time?: string;
  b4?: number; b5?: number; b6?: number; b7?: number;
  b_estimated_sleep?: number;
  b_discomfort?: number;
  b_flags?: string[];
  // PHQ-9
  p1?: number; p2?: number; p3?: number; p4?: number; p5?: number;
  p6?: number; p7?: number; p8?: number; p9?: number;
  phq9_total?: number;
  phq9_p9_alert?: boolean;
  // GAD-7
  g1?: number; g2?: number; g3?: number; g4?: number;
  g5?: number; g6?: number; g7?: number;
  gad7_total?: number;
  // リンク
  linked_from?: string;
};
