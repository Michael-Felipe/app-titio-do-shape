export interface FoodSuggestion {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  portion: string;
}

export const FOOD_SUGGESTIONS = {
  breakfast: [
    { name: 'Aveia com frutas', calories: 320, protein: 12, carbs: 55, fats: 8, portion: '1 tigela (200g)' },
    { name: 'Pão integral com ovo', calories: 280, protein: 18, carbs: 30, fats: 12, portion: '2 fatias + 1 ovo' },
    { name: 'Iogurte natural com granola', calories: 250, protein: 15, carbs: 35, fats: 6, portion: '1 pote (170g) + 2 colheres' },
    { name: 'Vitamina de frutas', calories: 180, protein: 5, carbs: 35, fats: 2, portion: '1 copo (300ml)' },
    { name: 'Café com leite e pão', calories: 220, protein: 10, carbs: 28, fats: 8, portion: '1 xícara + 1 fatia' },
  ],
  lunch: [
    { name: 'Arroz, feijão, frango e salada', calories: 550, protein: 45, carbs: 65, fats: 15, portion: 'Prato médio' },
    { name: 'Macarrão integral com molho', calories: 480, protein: 25, carbs: 70, fats: 12, portion: '1 prato (300g)' },
    { name: 'Peixe grelhado com legumes', calories: 420, protein: 40, carbs: 20, fats: 18, portion: '150g peixe + salada' },
    { name: 'Carne magra com batata doce', calories: 500, protein: 50, carbs: 35, fats: 20, portion: '150g carne + 200g batata' },
    { name: 'Salada completa com grão-de-bico', calories: 380, protein: 20, carbs: 45, fats: 14, portion: 'Grande porção' },
  ],
  dinner: [
    { name: 'Sopa de legumes com frango', calories: 320, protein: 35, carbs: 25, fats: 10, portion: '1 prato fundo' },
    { name: 'Omelete com salada', calories: 280, protein: 28, carbs: 15, fats: 16, portion: '2 ovos + salada' },
    { name: 'Peixe assado com arroz integral', calories: 450, protein: 38, carbs: 40, fats: 14, portion: '150g peixe + 100g arroz' },
    { name: 'Carne moída com legumes', calories: 380, protein: 42, carbs: 20, fats: 18, portion: '150g carne + legumes' },
    { name: 'Salada de atum com quinoa', calories: 360, protein: 32, carbs: 30, fats: 12, portion: '1 lata + 100g quinoa' },
  ],
  snack: [
    { name: 'Maçã com amêndoas', calories: 180, protein: 6, carbs: 25, fats: 10, portion: '1 maçã + 10 unidades' },
    { name: 'Iogurte grego', calories: 120, protein: 18, carbs: 8, fats: 2, portion: '1 pote (150g)' },
    { name: 'Banana com pasta de amendoim', calories: 220, protein: 7, carbs: 35, fats: 8, portion: '1 banana + 1 colher' },
    { name: 'Queijo branco com tomate', calories: 150, protein: 15, carbs: 8, fats: 8, portion: '100g queijo + 1 tomate' },
    { name: 'Mix de castanhas', calories: 200, protein: 8, carbs: 10, fats: 18, portion: '30g misturadas' },
  ],
};

export const getMealSuggestions = (mealType: string, dailyCalories: number, dailyProtein: number) => {
  const suggestions = FOOD_SUGGESTIONS[mealType as keyof typeof FOOD_SUGGESTIONS] || [];

  // Ajustar quantidades baseado nas metas diárias
  // Café da manhã: ~25% das calorias
  // Almoço: ~35% das calorias
  // Jantar: ~25% das calorias
  // Lanche: ~15% das calorias

  const percentages = {
    breakfast: 0.25,
    lunch: 0.35,
    dinner: 0.25,
    snack: 0.15,
  };

  const targetCalories = dailyCalories * (percentages[mealType as keyof typeof percentages] || 0.25);
  const targetProtein = dailyProtein * (percentages[mealType as keyof typeof percentages] || 0.25);

  return suggestions.map(suggestion => ({
    ...suggestion,
    // Ajustar quantidades proporcionalmente
    calories: Math.round(suggestion.calories * (targetCalories / suggestion.calories)),
    protein: Math.round(suggestion.protein * (targetProtein / suggestion.protein)),
    carbs: Math.round(suggestion.carbs * (targetCalories / suggestion.calories)),
    fats: Math.round(suggestion.fats * (targetCalories / suggestion.calories)),
  }));
};