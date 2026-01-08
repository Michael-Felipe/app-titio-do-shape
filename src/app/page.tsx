'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Dumbbell } from 'lucide-react';

export default function WelcomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      // Verificar se o usuário já completou o quiz
      const { data: profile } = await supabase
        .from('profiles')
        .select('daily_calories')
        .eq('id', session.user.id)
        .single();

      if (profile?.daily_calories) {
        router.push('/dashboard');
      } else {
        router.push('/quiz');
      }
    } else {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-400 to-pink-600">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-400 to-pink-600 p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Logo/Ícone */}
        <div className="flex justify-center">
          <div className="bg-white rounded-full p-6 shadow-2xl">
            <Dumbbell className="w-16 h-16 text-orange-500" />
          </div>
        </div>

        {/* Título */}
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
            Titio do Shape
          </h1>
          <div className="h-1 w-24 bg-white mx-auto rounded-full"></div>
        </div>

        {/* Frase de boas-vindas */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
          <p className="text-2xl md:text-3xl font-semibold text-white leading-relaxed">
            Relaxa. O titio cuida do seu shape.
          </p>
        </div>

        {/* Botão de iniciar */}
        <button
          onClick={() => router.push('/auth')}
          className="w-full bg-white text-orange-600 font-bold text-lg py-4 px-8 rounded-full shadow-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 ease-in-out"
        >
          Começar Agora
        </button>

        {/* Texto motivacional */}
        <p className="text-white/90 text-sm">
          Sua jornada de transformação começa aqui 💪
        </p>
      </div>
    </div>
  );
}
