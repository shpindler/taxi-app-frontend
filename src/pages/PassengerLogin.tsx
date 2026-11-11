import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { TextField } from '../components/TextField';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { loginSchema, type LoginFormValues } from '../validation/schemas';
import { ApiError, authApi } from '../api/auth';
import styles from './Login.module.css';

export function PassengerLoginPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: '', password: '', role: 'passenger' },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setServerError(null);
    try {
      const { token } = await authApi.passengerLogin(values);
      localStorage.setItem('token', token);
      navigate('/compare');
    } catch (e) {
      setServerError(e instanceof Error ? (e as ApiError).message : 'Не удалось войти');
    }
  };

  const role = useWatch({ control, name: 'role' });

  const onRoleChange = ({ onChange, role }) => {
    onChange(role);
    if (role == 'driver') {
      navigate('/driver-login');
    } else if (role == 'passenger') {
      navigate('/login');
    }
  }

  return (
    <AuthLayout title="Вход в аккаунт" subtitle="Рады видеть вас снова">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Controller
          name="role"
          control={control}
          render={({ field }) => (
            <RoleSwitcher
              value={field.value}
              onChange={(role) => onRoleChange({ onChange: field.onChange, role })}
            />
          )}
        />

        <TextField
          label="Номер телефона"
          type="tel"
          placeholder="+7 999 123-45-67"
          autoComplete="tel"
          error={errors.login?.message}
          {...register('login')}
        />
        <TextField
          label="Пароль"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && <p className={styles.formError}>{serverError}</p>}

        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Вход…' : 'Войти'}
        </button>

        <p className={styles.footer}>
          Нет аккаунта? <Link
            to="/passenger-register"
          >Зарегистрироваться</Link>
        </p>
      </form>
    </AuthLayout>
  );
}