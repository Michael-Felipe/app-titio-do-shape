export interface Profile {
  id: string;
  name?: string;
  age?: number;
  gender?: string;
  weight?: number;
  height?: number;
  activity_level?: string;
  goal?: string;
  target_weight?: number;
  daily_calories?: number;
  daily_protein?: number;
  daily_carbs?: number;
  daily_fats?: number;
  daily_water?: number;
  created_at?: string;
  updated_at?: string;
}

export interface QuizData {
  weight: number;
  height: number;
  age: number;
  gender: string;
  activity_level: string;
  goal: string;
  target_weight: number;
  difficulties: string;
  routine: string;
  event_deadline?: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  weight?: number;
  calories_consumed: number;
  protein_consumed: number;
  carbs_consumed: number;
  fats_consumed: number;
  water_consumed: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Meal {
  id: string;
  user_id: string;
  daily_log_id?: string;
  meal_type: string;
  description: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  created_at?: string;
}

export interface WaterIntake {
  id: string;
  user_id: string;
  daily_log_id?: string;
  amount_ml: number;
  time?: string;
  created_at?: string;
}

export type MealType =
  | 'breakfast'
  | 'lunch'
  | 'dinner'
  | 'snack';

export const MEAL_LABELS: Record<string, string> = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  dinner: 'Jantar',
  snack: 'Lanche',
};