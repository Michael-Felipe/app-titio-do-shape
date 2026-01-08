import { QuizData } from './types';

// Cálculo de TMB (Taxa Metabólica Basal) usando fórmula de Mifflin-St Jeor
export function calculateBMR(weight: number, height: number, age: number, gender: string): number {
  if (gender === 'masculino') {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    return 10 * weight + 6.25 * height - 5 * age - 161;
  }
}

// Multiplicadores de atividade física
const ACTIVITY_MULTIPLIERS: Record<string, number> = {
  sedentario: 1.2,
  leve: 1.375,
  moderado: 1.55,
  intenso: 1.725,
  muito_intenso: 1.9,
};

// Calcular TDEE (Total Daily Energy Expenditure)
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel] || 1.2;
  return bmr * multiplier;
}

// Calcular calorias diárias baseado no objetivo
export function calculateDailyCalories(tdee: number, goal: string): number {
  switch (goal) {
    case 'emagrecer':
      return Math.round(tdee - 500); // Déficit de 500 calorias
    case 'ganhar_massa':
      return Math.round(tdee + 300); // Superávit de 300 calorias
    case 'manter':
      return Math.round(tdee);
    default:
      return Math.round(tdee);
  }
}

// Calcular macronutrientes
export function calculateMacros(dailyCalories: number, goal: string) {
  let proteinPercent = 0.3;
  let carbsPercent = 0.4;
  let fatsPercent = 0.3;

  if (goal === 'emagrecer') {
    proteinPercent = 0.35;
    carbsPercent = 0.35;
    fatsPercent = 0.3;
  } else if (goal === 'ganhar_massa') {
    proteinPercent = 0.3;
    carbsPercent = 0.45;
    fatsPercent = 0.25;
  }

  return {
    protein: Math.round((dailyCalories * proteinPercent) / 4), // 4 cal/g
    carbs: Math.round((dailyCalories * carbsPercent) / 4), // 4 cal/g
    fats: Math.round((dailyCalories * fatsPercent) / 9), // 9 cal/g
  };
}

// Calcular ingestão diária de água (ml)
export function calculateDailyWater(weight: number): number {
  return Math.round(weight * 35); // 35ml por kg de peso
}

// Função principal que calcula tudo
export function calculateNutritionPlan(data: QuizData) {
  const bmr = calculateBMR(data.weight, data.height, data.age, data.gender);
  const tdee = calculateTDEE(bmr, data.activity_level);
  const dailyCalories = calculateDailyCalories(tdee, data.goal);
  const macros = calculateMacros(dailyCalories, data.goal);
  const dailyWater = calculateDailyWater(data.weight);

  return {
    daily_calories: dailyCalories,
    daily_protein: macros.protein,
    daily_carbs: macros.carbs,
    daily_fats: macros.fats,
    daily_water: dailyWater,
  };
}
