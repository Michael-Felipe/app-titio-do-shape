'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { calculateNutritionPlan } from '@/lib/calculations';
import { QuizData } from '@/lib/types';
import { ArrowRight, ArrowLeft } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [quizData, setQuizData] = useState<QuizData>({
    weight: 0,
    height: 0,
    age: 0,
    gender: '',
    activity_level: '',
    goal: '',
    target_weight: 0,
    difficulties: '',
    routine: '',
    event_deadline: '',
  });

  const totalSteps = 9;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }

      // Calcular plano nutricional
      const nutritionPlan = calculateNutritionPlan(quizData);

      // Atualizar perfil com dados do quiz e cálculos
      const { error } = await supabase
        .from('profiles')
        .update({
          weight: quizData.weight,
          height: quizData.height,
          age: quizData.age,
          gender: quizData.gender,
          activity_level: quizData.activity_level,
          goal: quizData.goal,
          target_weight: quizData.target_weight,
          difficulties: quizData.difficulties,
          routine: quizData.routine,
          event_deadline: quizData.event_deadline || null,
          ...nutritionPlan,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      router.push('/result');
    } catch (err) {
      console.error('Erro ao salvar quiz:', err);
      alert('Erro ao salvar dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Qual é o seu peso atual?</h3>
            <input
              type="number"
              step="0.1"
              value={quizData.weight || ''}
              onChange={(e) => setQuizData({ ...quizData, weight: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Ex: 75.5"
            />
            <p className="text-sm text-gray-600">Em quilogramas (kg)</p>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Qual é a sua altura?</h3>
            <input
              type="number"
              step="1"
              value={quizData.height || ''}
              onChange={(e) => setQuizData({ ...quizData, height: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Ex: 175"
            />
            <p className="text-sm text-gray-600">Em centímetros (cm)</p>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Qual é a sua idade?</h3>
            <input
              type="number"
              value={quizData.age || ''}
              onChange={(e) => setQuizData({ ...quizData, age: parseInt(e.target.value) })}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Ex: 30"
            />
            <p className="text-sm text-gray-600">Em anos</p>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Qual é o seu sexo biológico?</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setQuizData({ ...quizData, gender: 'masculino' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  quizData.gender === 'masculino'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-300'
                }`}
              >
                <p className="font-semibold">Masculino</p>
              </button>
              <button
                onClick={() => setQuizData({ ...quizData, gender: 'feminino' })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  quizData.gender === 'feminino'
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-300 hover:border-orange-300'
                }`}
              >
                <p className="font-semibold">Feminino</p>
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Qual é o seu nível de atividade física?</h3>
            <div className="space-y-3">
              {[
                { value: 'sedentario', label: 'Sedentário', desc: 'Pouco ou nenhum exercício' },
                { value: 'leve', label: 'Leve', desc: '1-3 dias por semana' },
                { value: 'moderado', label: 'Moderado', desc: '3-5 dias por semana' },
                { value: 'intenso', label: 'Intenso', desc: '6-7 dias por semana' },
                { value: 'muito_intenso', label: 'Muito Intenso', desc: 'Atleta ou trabalho físico' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setQuizData({ ...quizData, activity_level: option.value })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    quizData.activity_level === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}
                >
                  <p className="font-semibold">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Qual é o seu objetivo principal?</h3>
            <div className="space-y-3">
              {[
                { value: 'emagrecer', label: 'Emagrecer', desc: 'Perder gordura corporal' },
                { value: 'ganhar_massa', label: 'Ganhar Massa', desc: 'Aumentar músculos' },
                { value: 'manter', label: 'Manter', desc: 'Manter peso atual' },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setQuizData({ ...quizData, goal: option.value })}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    quizData.goal === option.value
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-gray-300 hover:border-orange-300'
                  }`}
                >
                  <p className="font-semibold">{option.label}</p>
                  <p className="text-sm text-gray-600">{option.desc}</p>
                </button>
              ))}
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Qual é o seu peso desejado?</h3>
            <input
              type="number"
              step="0.1"
              value={quizData.target_weight || ''}
              onChange={(e) => setQuizData({ ...quizData, target_weight: parseFloat(e.target.value) })}
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Ex: 70.0"
            />
            <p className="text-sm text-gray-600">Em quilogramas (kg)</p>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Quais são suas maiores dificuldades com alimentação?</h3>
            <textarea
              value={quizData.difficulties}
              onChange={(e) => setQuizData({ ...quizData, difficulties: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              rows={4}
              placeholder="Ex: Comer fora de casa, ansiedade, doces..."
            />
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Como é a sua rotina diária?</h3>
            <textarea
              value={quizData.routine}
              onChange={(e) => setQuizData({ ...quizData, routine: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
              rows={4}
              placeholder="Ex: Trabalho das 8h às 18h, treino à noite..."
            />
            
            <div className="pt-4">
              <label className="text-sm font-medium text-gray-700">Tem algum evento ou prazo específico? (opcional)</label>
              <input
                type="date"
                value={quizData.event_deadline}
                onChange={(e) => setQuizData({ ...quizData, event_deadline: e.target.value })}
                className="w-full mt-2 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1: return quizData.weight > 0;
      case 2: return quizData.height > 0;
      case 3: return quizData.age > 0;
      case 4: return quizData.gender !== '';
      case 5: return quizData.activity_level !== '';
      case 6: return quizData.goal !== '';
      case 7: return quizData.target_weight > 0;
      case 8: return quizData.difficulties.trim() !== '';
      case 9: return quizData.routine.trim() !== '';
      default: return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-pink-600 p-4 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
        {/* Progresso */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Pergunta {step} de {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-pink-600 transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Conteúdo da pergunta */}
        <div className="min-h-[300px] flex items-center">
          {renderStep()}
        </div>

        {/* Botões de navegação */}
        <div className="flex gap-4">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="flex items-center gap-2 px-6 py-3 border-2 border-gray-300 rounded-xl hover:border-orange-500 transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
          )}
          
          {step < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              Próxima
              <ArrowRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed() || loading}
              className="flex-1 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Salvando...' : 'Finalizar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
