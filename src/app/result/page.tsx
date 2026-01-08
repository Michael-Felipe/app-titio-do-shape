'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/types';
import { Target, Droplets, Flame, TrendingUp, Heart } from 'lucide-react';

export default function ResultPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth');
        return;
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (err) {
      console.error('Erro ao carregar perfil:', err);
    } finally {
      setLoading(false);
    }
  }

  const getGoalMessage = (goal: string) => {
    switch (goal) {
      case 'emagrecer':
        return 'Seu objetivo é emagrecer de forma saudável e sustentável. Vamos focar em criar um déficit calórico controlado, mantendo sua energia e saúde em dia.';
      case 'ganhar_massa':
        return 'Seu objetivo é ganhar massa muscular. Vamos trabalhar com um superávit calórico estratégico e proteínas adequadas para construir músculos de qualidade.';
      case 'manter':
        return 'Seu objetivo é manter seu peso atual. Vamos equilibrar suas calorias para manter sua composição corporal enquanto você se sente bem e saudável.';
      default:
        return '';
    }
  };

  const getMotivationalMessage = (goal: string, name?: string) => {
    const firstName = name?.split(' ')[0] || 'Guerreiro(a)';
    
    switch (goal) {
      case 'emagrecer':
        return `${firstName}, você está prestes a iniciar uma jornada incrível! Cada passo conta, cada escolha importa. O titio está aqui para te guiar nessa transformação. Vamos juntos! 💪`;
      case 'ganhar_massa':
        return `${firstName}, chegou a hora de construir o shape dos sonhos! Com disciplina e o plano certo, você vai surpreender a si mesmo. O titio acredita em você! 🔥`;
      case 'manter':
        return `${firstName}, manter é tão importante quanto conquistar! Você está no caminho certo para uma vida equilibrada e saudável. Continue assim! ✨`;
      default:
        return `${firstName}, sua jornada começa agora! O titio está aqui para te apoiar em cada passo. Vamos juntos! 🚀`;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-600">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  const weightDiff = Math.abs((profile.target_weight || 0) - (profile.weight || 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-pink-600 p-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Seu Plano Está Pronto! 🎉
          </h1>
          <p className="text-white/90 text-lg">
            Vamos começar sua transformação
          </p>
        </div>

        {/* Resumo do Perfil */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Seu Perfil</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-orange-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Peso Atual</p>
                <p className="text-2xl font-bold text-orange-600">{profile.weight} kg</p>
              </div>
              <div className="bg-pink-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Altura</p>
                <p className="text-2xl font-bold text-pink-600">{profile.height} cm</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Idade</p>
                <p className="text-2xl font-bold text-purple-600">{profile.age} anos</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">Meta</p>
                <p className="text-2xl font-bold text-blue-600">{profile.target_weight} kg</p>
              </div>
            </div>
          </div>

          {/* Objetivo */}
          <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Target className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Seu Objetivo</h3>
                <p className="text-gray-700 leading-relaxed">
                  {getGoalMessage(profile.goal || '')}
                </p>
              </div>
            </div>
          </div>

          {/* Plano Nutricional */}
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4">Seu Plano Diário</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-6 h-6" />
                  <h4 className="font-bold text-lg">Calorias</h4>
                </div>
                <p className="text-4xl font-bold">{profile.daily_calories}</p>
                <p className="text-white/80 text-sm mt-1">kcal por dia</p>
              </div>

              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Droplets className="w-6 h-6" />
                  <h4 className="font-bold text-lg">Água</h4>
                </div>
                <p className="text-4xl font-bold">{Math.round((profile.daily_water || 0) / 250)}</p>
                <p className="text-white/80 text-sm mt-1">copos por dia (~{profile.daily_water}ml)</p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
                <p className="text-sm text-gray-600 mb-1">Proteínas</p>
                <p className="text-2xl font-bold text-gray-800">{profile.daily_protein}g</p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
                <p className="text-sm text-gray-600 mb-1">Carboidratos</p>
                <p className="text-2xl font-bold text-gray-800">{profile.daily_carbs}g</p>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-2xl p-4">
                <p className="text-sm text-gray-600 mb-1">Gorduras</p>
                <p className="text-2xl font-bold text-gray-800">{profile.daily_fats}g</p>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-5 h-5" />
                  <p className="text-sm">Para atingir sua meta</p>
                </div>
                <p className="text-2xl font-bold">{weightDiff.toFixed(1)} kg</p>
              </div>
            </div>
          </div>

          {/* Mensagem Motivacional */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
            <div className="flex items-start gap-3">
              <Heart className="w-6 h-6 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-lg font-bold mb-2">Mensagem do Titio</h3>
                <p className="leading-relaxed">
                  {getMotivationalMessage(profile.goal || '', profile.name)}
                </p>
              </div>
            </div>
          </div>

          {/* Botão para continuar */}
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold text-lg py-4 rounded-2xl hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Começar Minha Jornada
          </button>
        </div>
      </div>
    </div>
  );
}
