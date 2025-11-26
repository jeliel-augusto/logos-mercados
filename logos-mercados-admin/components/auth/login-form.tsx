'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button, Container, Paper, Stack, Text, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useAuth } from '../../lib/auth';

const loginSchema = z.object({
  email: z.email('Email inválido').min(1, 'Email é obrigatório'),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .min(1, 'Senha é obrigatória'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);

    try {
      await login(values.email, values.password);

      notifications.show({
        title: 'Sucesso!',
        message: 'Login realizado com sucesso.',
        color: 'green',
      });

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);

      let errorMessage = 'Ocorreu um erro ao fazer login. Tente novamente.';

      if (error?.status === 401) {
        errorMessage = 'Email ou senha incorretos.';
      } else if (error?.status === 429) {
        errorMessage = 'Muitas tentativas. Tente novamente mais tarde.';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      notifications.show({
        title: 'Erro de autenticação',
        message: errorMessage,
        color: 'red',
      });

      if (error?.status === 401) {
        setError('root', { message: errorMessage });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title ta="center" mb="md">
        Bem-vindo ao Portal Administrativo
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Entre com suas credenciais para acessar o painel administrativo
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <TextInput
              label="Email"
              placeholder="seu@email.com"
              required
              {...register('email')}
              error={errors.email?.message}
            />

            <TextInput
              label="Senha"
              placeholder="Digite sua senha"
              type="password"
              required
              {...register('password')}
              error={errors.password?.message}
            />

            {errors.root && (
              <Text c="red" size="sm">
                {errors.root.message}
              </Text>
            )}

            <Button fullWidth loading={loading} type="submit">
              Entrar
            </Button>
          </Stack>
        </form>
      </Paper>
    </Container>
  );
}
