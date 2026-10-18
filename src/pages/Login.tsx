import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { TextField } from '../components/TextField';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { loginSchema, type LoginFormValues } from '../validation/schemas';
import { authApi } from '../api/auth';

export function LoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '', role: 'passenger' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const { token, user } = await authApi.login(values);
      localStorage.setItem('token', token);
      navigate(user.role === 'driver' ? '/driver' : '/passenger');
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Не удалось войти');
    }
  };

  return (
    <AuthLayout title="Вход в аккаунт" subtitle="Рады видеть вас снова">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <RoleSwitcher value={field.value} onChange={field.onChange} />
          )}
        />

        <TextField
          label="Номер телефона"
          type="tel"
          placeholder="+7 999 123-45-67"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />

        <TextField
          label="Пароль"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && <p className="form-error">{serverError}</p>}

        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Вход…' : 'Войти'}
        </button>

        <p className="auth-footer">
          Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
        </p>
      </form>
    </AuthLayout>
  );
}