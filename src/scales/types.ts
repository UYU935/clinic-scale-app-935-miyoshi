export type AnswerValue = 0 | 1 | 2 | 3;

export type QuestionType = 'scale' | 'yes_no' | 'time_select' | 'scale_5';

export type AnswerOption = {
  value: number | string;
  label: string;
};

export type Question = {
  id: string;
  sectionId: string;
  text: string;
  type: QuestionType;
  options?: AnswerOption[];
  isSafetyItem?: boolean;
};

export type Section = {
  id: string;
  title: string;
  description?: string;
  maxScore: number;
};

export type ScaleDefinition = {
  id: string;
  title: string;
  internalName: string;
  description: string;
  sections: Section[];
  questions: Question[];
};

export type SectionScore = {
  sectionId: string;
  rawScore: number;
  maxScore: number;
  level: string;
};

export type TagResult = {
  id: string;
  label: string;
  patientText: string;
};

export type SafetyAlert = {
  id: string;
  label: string;
  isPositive: boolean;
  message: string;
  severity: 'notice' | 'warning' | 'urgent';
};

export type ScoreResult = {
  scaleId: string;
  createdAt: string;
  sectionScores: SectionScore[];
  tags: TagResult[];
  safetyAlerts: SafetyAlert[];
};

export type Answers = Record<string, AnswerValue | boolean>;

// デジタル健康スケール用追加型
export type StorageAnswer = {
  value: number;
  recordedAt: string; // ISO 8601
};

export type StorageMode = 'none' | 'supabase';

export type DhAnswers = Record<string, number | string>;
