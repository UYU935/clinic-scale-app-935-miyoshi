import type { ScaleDefinition } from '../types';

export const entMoodAnxietyLifeImpactDefinition: ScaleDefinition = {
  id: 'ent_mood_anxiety_life_impact',
  title: '症状と生活支障の整理シート',
  internalName: '耳鼻科症状関連 不安・気分・生活支障スコア',
  description:
    'めまい・耳鳴り・のどの違和感などの症状が、日常生活や気分にどのように影響しているかを整理するシートです。',
  sections: [
    {
      id: 'A',
      title: '症状負担',
      description: '症状そのものによる負担の程度を示します。',
      maxScore: 12,
    },
    {
      id: 'B',
      title: '不安・警戒',
      description: '症状への注意や再発不安がどの程度高まりやすいかを示します。',
      maxScore: 15,
    },
    {
      id: 'C',
      title: '気分・意欲',
      description: '体調不良の持続により、気分や意欲に影響が出ている可能性を示します。',
      maxScore: 15,
    },
    {
      id: 'D',
      title: '回避・生活制限',
      description: '外出、移動、仕事、家事などを控える傾向を示します。',
      maxScore: 15,
    },
    {
      id: 'E',
      title: '睡眠・疲労',
      description: '睡眠不足、疲労、気圧、画面作業などの影響を示します。',
      maxScore: 15,
    },
    {
      id: 'F',
      title: '説明・支援ニーズ',
      description: '症状の仕組みや対処法について、説明や支援を必要としている程度を示します。',
      maxScore: 15,
    },
    {
      id: 'S',
      title: '医師確認項目',
      description: '医師が確認する項目です。',
      maxScore: 0,
    },
  ],
  questions: [
    // A: 症状負担スコア（最大12点）
    {
      id: 'A1',
      sectionId: 'A',
      text: 'めまい、ふらつき、耳鳴り、音のつらさ、のどの違和感などで困ることがある',
      type: 'scale',
    },
    {
      id: 'A2',
      sectionId: 'A',
      text: '症状のために、日常生活の中で集中しにくいことがある',
      type: 'scale',
    },
    {
      id: 'A3',
      sectionId: 'A',
      text: '症状がいつ出るか気になり、安心して過ごしにくい',
      type: 'scale',
    },
    {
      id: 'A4',
      sectionId: 'A',
      text: '症状の波があり、予定を立てにくいと感じる',
      type: 'scale',
    },
    // B: 不安・警戒スコア（最大15点）
    {
      id: 'B1',
      sectionId: 'B',
      text: '症状がまた起きるのではないかと心配になる',
      type: 'scale',
    },
    {
      id: 'B2',
      sectionId: 'B',
      text: '悪い病気が隠れているのではないかと不安になる',
      type: 'scale',
    },
    {
      id: 'B3',
      sectionId: 'B',
      text: '体の変化に敏感になり、つい確認してしまう',
      type: 'scale',
    },
    {
      id: 'B4',
      sectionId: 'B',
      text: '症状のことを考え始めると、なかなか頭から離れない',
      type: 'scale',
    },
    {
      id: 'B5',
      sectionId: 'B',
      text: '外出先や仕事中に症状が出たらどうしようと思う',
      type: 'scale',
    },
    // C: 気分・意欲スコア（最大15点）
    {
      id: 'C1',
      sectionId: 'C',
      text: '気分が沈みやすい',
      type: 'scale',
    },
    {
      id: 'C2',
      sectionId: 'C',
      text: '以前より楽しめることが減った',
      type: 'scale',
    },
    {
      id: 'C3',
      sectionId: 'C',
      text: '物事に取りかかる気力が出にくい',
      type: 'scale',
    },
    {
      id: 'C4',
      sectionId: 'C',
      text: '自分の体調に自信が持てない',
      type: 'scale',
    },
    {
      id: 'C5',
      sectionId: 'C',
      text: 'この状態が続くのではないかと悲観的になる',
      type: 'scale',
    },
    // D: 回避・生活制限スコア（最大15点）
    {
      id: 'D1',
      sectionId: 'D',
      text: '人混み、スーパー、駅、ショッピングモールなどを避けることがある',
      type: 'scale',
    },
    {
      id: 'D2',
      sectionId: 'D',
      text: '車、電車、バス、エレベーターなどの移動を避けることがある',
      type: 'scale',
    },
    {
      id: 'D3',
      sectionId: 'D',
      text: '仕事、家事、学校、外出の量を減らしている',
      type: 'scale',
    },
    {
      id: 'D4',
      sectionId: 'D',
      text: '症状が出そうな場所や場面を事前に避ける',
      type: 'scale',
    },
    {
      id: 'D5',
      sectionId: 'D',
      text: '家族や周囲に頼る場面が増えている',
      type: 'scale',
    },
    // E: 睡眠・疲労スコア（最大15点）
    {
      id: 'E1',
      sectionId: 'E',
      text: '睡眠不足や睡眠の質の悪さを感じる',
      type: 'scale',
    },
    {
      id: 'E2',
      sectionId: 'E',
      text: '疲れがたまると症状が悪くなりやすい',
      type: 'scale',
    },
    {
      id: 'E3',
      sectionId: 'E',
      text: '天気、気圧、季節、気温差で体調が変わりやすい',
      type: 'scale',
    },
    {
      id: 'E4',
      sectionId: 'E',
      text: 'スマホ、パソコン、画面作業で症状が悪くなりやすい',
      type: 'scale',
    },
    {
      id: 'E5',
      sectionId: 'E',
      text: '首こり、肩こり、目の疲れ、頭重感を伴うことがある',
      type: 'scale',
    },
    // F: 説明・支援ニーズスコア（最大15点）
    {
      id: 'F1',
      sectionId: 'F',
      text: '今の症状について、原因や仕組みをもっと知りたい',
      type: 'scale',
    },
    {
      id: 'F2',
      sectionId: 'F',
      text: '検査で危険な病気がないか確認したい',
      type: 'scale',
    },
    {
      id: 'F3',
      sectionId: 'F',
      text: '薬だけでなく、生活上の工夫も知りたい',
      type: 'scale',
    },
    {
      id: 'F4',
      sectionId: 'F',
      text: 'リハビリ、慣らし方、対処法を知りたい',
      type: 'scale',
    },
    {
      id: 'F5',
      sectionId: 'F',
      text: '家族や職場にどう説明すればよいか知りたい',
      type: 'scale',
    },
    // S: 医師確認項目（yes/no）
    {
      id: 'S1',
      sectionId: 'S',
      text: 'この数週間で、消えてしまいたい、死にたいと思うことがある',
      type: 'yes_no',
      isSafetyItem: true,
    },
    {
      id: 'S2',
      sectionId: 'S',
      text: '食事・睡眠・仕事・家事が大きく崩れている',
      type: 'yes_no',
      isSafetyItem: true,
    },
    {
      id: 'S3',
      sectionId: 'S',
      text: 'パニックのような強い発作で救急受診を考えることがある',
      type: 'yes_no',
      isSafetyItem: true,
    },
    {
      id: 'S4',
      sectionId: 'S',
      text: '急な難聴、ろれつが回らない、手足の麻痺、激しい頭痛がある',
      type: 'yes_no',
      isSafetyItem: true,
    },
    {
      id: 'S5',
      sectionId: 'S',
      text: '家族や周囲から見て、普段と明らかに様子が違うと言われる',
      type: 'yes_no',
      isSafetyItem: true,
    },
  ],
};
