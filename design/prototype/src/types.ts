export type NavigationTab = 'resources' | 'solve' | 'past-performance' | 'settings' | 'support';

export type QuestionCategory = 'revenue-profit' | 'mathematical' | 'market-sizing' | 'unconventional';

export type DifficultyLevel = 'easy' | 'medium' | 'challenging';

export type TargetFirm = 
  | 'McKinsey & Company'
  | 'Boston Consulting Group'
  | 'Bain & Company'
  | 'Strategy&'
  | 'Oliver Wyman'
  | 'Roland Berger'
  | 'Big 4 Consulting';

export interface DataPoint {
  label: string;
  value: string;
  category?: string;
  note?: string;
}

export interface ModelStep {
  title: string;
  detail: string;
  calculation?: string;
}

export interface ModelAnswer {
  summary: string;
  stepByStep: ModelStep[];
  sanityCheck: string;
  executiveSummary: string;
}

export interface GuesstimateQuestion {
  id: string;
  title: string;
  category: QuestionCategory;
  categoryLabel: string;
  difficulty: DifficultyLevel;
  timeLimitMinutes: number;
  industry?: string;
  region?: string;
  contextPrompt: string;
  keyDataPoints: DataPoint[];
  suggestedStructure: string[];
  modelAnswer: ModelAnswer;
}

export interface RubricScore {
  structuringScore: number; // out of 3
  benchmarksScore: number; // out of 3
  mathScore: number; // out of 2
  synthesisScore: number; // out of 2
}

export interface AIEvaluationResult {
  overallScore: number; // e.g. 8 (out of 10)
  ratingLabel: string; // e.g. "MBB Interview Ready", "Strong Framework", "Needs Math Precision"
  whatYouDidWell: string[];
  areasForImprovement: string[];
  rubric: RubricScore;
  feedbackSummary: string;
  calculationErrorsFound: string[];
  missingKeyAssumptions: string[];
  modelComparison: string;
}

export interface CaseAttempt {
  id: string;
  date: string;
  questionTitle: string;
  category: QuestionCategory;
  categoryLabel: string;
  difficulty: DifficultyLevel;
  studentAnswer: string;
  timeSpentSeconds: number;
  evaluation: AIEvaluationResult;
  questionRef?: GuesstimateQuestion;
}

export interface DatasheetMetric {
  id: string;
  metric: string;
  value: string;
  category: 'Demographics' | 'Economics' | 'Consumer Behavior' | 'Infrastructure' | 'Conversion Rates';
  region: 'Global' | 'US' | 'UK' | 'Europe' | 'India';
  sourceOrNote: string;
}

export interface StudentProfile {
  name: string;
  university: string;
  targetRole: string;
  targetFirm: TargetFirm;
  targetYear: string;
  streakDays: number;
  completedCasesCount: number;
  averageRating: number;
}
