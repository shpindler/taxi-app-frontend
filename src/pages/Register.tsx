import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { TextField } from '../components/TextField';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { registerSchema, type RegisterFormValues } from '../validation/schemas';
import { authApi } from '../api/auth';

export function RegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'passenger',
      acceptTerms: false as unknown as true,
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    setServerError(null);
    try {
      const { token, user } = await authApi.register(values);
      localStorage.setItem('token', token);
      navigate(user.role === 'driver' ? '/driver' : '/passenger');
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Ошибка регистрации');
    }
  };

  return (
    <AuthLayout title="Создать аккаунт" subtitle="Поехали!">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <RoleSwitcher value={field.value} onChange={field.onChange} />
          )}
        />

        <TextField
          label="Имя"
          autoComplete="name"
          error={errors.name?.message}
          {...register('name')}
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
          label="Email"
          type="email"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />
        <TextField
          label="Пароль"
          type="password"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <TextField
          label="Повторите пароль"
          type="password"
          autoComplete="new-password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <label className="checkbox">
          <input type="checkbox" {...register('acceptTerms')} />
          <span>
            Я принимаю <a href="/terms">условия использования</a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className="field__error">{errors.acceptTerms.message}</p>
        )}

        {serverError && <p className="form-error">{serverError}</p>}

        <button type="submit" className="btn btn--primary" disabled={isSubmitting}>
          {isSubmitting ? 'Создаём…' : 'Зарегистрироваться'}
        </button>

        <p className="auth-footer">
          Уже есть аккаунт? <Link to="/login">Войти</Link>
        </p>
      </form>
    </AuthLayout>
  );
}