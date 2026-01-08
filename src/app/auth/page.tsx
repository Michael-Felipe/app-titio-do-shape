'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, User, ArrowLeft } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.user) {
          // Verificar se o perfil existe
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('daily_calories')
            .eq('id', data.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            // Se erro diferente de "não encontrado", mostrar erro
            throw profileError;
          }

          // Se perfil existe e tem daily_calories, vai para dashboard
          // Senão, vai para quiz
          if (profile?.daily_calories) {
            router.push('/dashboard');
          } else {
            router.push('/quiz');
          }
        }
      } else {
        // Cadastro
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        if (data.user) {
          try {
            // Criar perfil inicial
            const { error: profileError } = await supabase.from('profiles').insert({
              id: data.user.id,
              email: formData.email,
              name: formData.name,
            });

            if (profileError) {
              console.error('Erro ao criar perfil:', profileError);
              // Mesmo com erro no perfil, continua para quiz
              // O perfil pode ser criado depois se necessário
            }

            router.push('/quiz');
          } catch (profileErr) {
            console.error('Erro inesperado ao criar perfil:', profileErr);
            // Continua mesmo com erro no perfil
            router.push('/quiz');
          }
        }
      }
    } catch (err: any) {
      console.error('Erro de autenticação:', err);

      // Verificar se é erro de email não confirmado
      if (err.message && err.message.toLowerCase().includes('email not confirmed')) {
        try {
          // Reenviar email de confirmação
          await supabase.auth.resend({
            type: 'signup',
            email: formData.email,
          });
          setError('Email não confirmado. Enviamos um novo link de confirmação para seu email. Verifique sua caixa de entrada e spam.');
        } catch (resendError: any) {
          console.error('Erro ao reenviar confirmação:', resendError);
          setError('Email não confirmado. Não foi possível reenviar a confirmação. Tente novamente mais tarde.');
        }
      } else if (err.message && err.message.toLowerCase().includes('invalid login credentials')) {
        setError('Email ou senha incorretos. Verifique seus dados e tente novamente.');
      } else {
        setError(err.message || 'Ocorreu um erro. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-400 to-pink-600 p-4">
      {/* Botão voltar */}
      <button
        onClick={() => router.push('/')}
        className="self-start mt-4 ml-4 text-white hover:bg-white/20 p-2 rounded-full transition-all"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          {/* Título */}
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLogin ? 'Bem-vindo de volta!' : 'Criar conta'}
            </h2>
            <p className="text-gray-600">
              {isLogin
                ? 'Entre para continuar sua jornada'
                : 'Comece sua transformação hoje'}
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nome</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                    placeholder="Seu nome"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  placeholder="••••••••"
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Carregando...' : isLogin ? 'Entrar' : 'Criar Conta'}
            </button>
          </form>

          {/* Toggle entre login e cadastro */}
          <div className="text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-orange-600 hover:text-orange-700 font-medium text-sm"
            >
              {isLogin
                ? 'Não tem conta? Cadastre-se'
                : 'Já tem conta? Faça login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}