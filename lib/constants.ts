export const SALARY_RANGES = [
  { value: 'BELOW_6K', label: 'Abaixo de 6K' },
  { value: 'RANGE_6K_7K', label: 'De 6K a 7K' },
  { value: 'RANGE_7K_8K', label: 'De 7K a 8K' },
  { value: 'RANGE_8K_10K', label: 'De 8K a 10K' },
  { value: 'ABOVE_10K', label: 'Acima de 10K' },
];

export const DEFAULT_SKILLS = {
  STRATEGIC: [
    'Pensamento Estratégico',
    'Análise de Dados',
    'Gestão de Riscos',
    'Gestão Financeira',
    'Análise de Indicadores de Desempenho',
  ],
  TECHNICAL: [
    'Gestão OKR',
    'Scrum & Kanban',
    'Design Thinking',
    'Lean',
    'Gestão de Backlog',
    'Estimativas de Esforço',
    'Inteligência Artificial',
  ],
  COMMUNICATION: [
    'Liderança',
    'Comunicação Eficaz',
    'Inteligência Emocional',
    'Gestão de Pessoas',
  ],
};

export const SKILL_SCORE_LEGEND = [
  {
    range: '1-3',
    color: 'red',
    label: 'Apenas conhecimento teórico',
    emoji: '🔴',
  },
  {
    range: '4-6',
    color: 'yellow',
    label: 'Alguma experiência prática',
    emoji: '🟡',
  },
  {
    range: '7-10',
    color: 'green',
    label: 'Domínio avançado e aplicável',
    emoji: '🟢',
  },
];

export const JOURNEY_STEPS = [
  { id: 1, label: 'PONTO DE PARTIDA', shortLabel: 'Partida' },
  { id: 2, label: 'AUTO-CONHECIMENTO', shortLabel: 'Auto-Conhecimento' },
  { id: 3, label: 'MAPEAMENTO', shortLabel: 'Mapeamento' },
  { id: 4, label: 'PLANO DE AÇÃO', shortLabel: 'Plano de Ação' },
];

export const BACKLOG_QUADRANTS = [
  { id: 1, label: 'Urgente e Importante', color: 'red' },
  { id: 2, label: 'Importante, Não Urgente', color: 'blue' },
  { id: 3, label: 'Urgente, Não Importante', color: 'yellow' },
  { id: 4, label: 'Nem Urgente, Nem Importante', color: 'gray' },
];
