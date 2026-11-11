import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { TextField } from '../components/TextField';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { DocumentUpload } from '../components/DocumentUpload';
import {
  driverRegisterSchema,
  type DriverRegisterFormValues,
} from '../validation/schemas';
import { authApi } from '../api/auth';
import type { DriverDocumentKind } from '../types/auth';
import styles from './Login.module.css';

const DOC_FIELDS: { key: DriverDocumentKind; label: string; hint: string }[] = [
  {
    key: 'license',
    label: 'Водительские права',
    hint: 'Лицевая сторона, обе страницы или PDF',
  },
  {
    key: 'vehicleRegistration',
    label: 'СТС автомобиля',
    hint: 'Свидетельство о регистрации транспортного средства',
  },
  {
    key: 'taxiRegistry',
    label: 'Выписка из реестра такси',
    hint: 'Реестр такси Москвы и Московской области',
  },
];

export function DriverRegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DriverRegisterFormValues>({
    resolver: zodResolver(driverRegisterSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'passenger',
      acceptTerms: false as unknown as true,
      driverDocuments: {
        license: undefined,
        vehicleRegistration: undefined,
        taxiRegistry: undefined,
      },
    },
  });

  const role = useWatch({ control, name: 'role' });
  const driverDocs = useWatch({ control, name: 'driverDocuments' });

  const onSubmit = async (values: DriverRegisterFormValues) => {
    setServerError(null);
    try {
      const { token, user } = await authApi.registerDriver(values)
      localStorage.setItem('token', token);
      // Пассажир попадает на сравнение — карта запросится перед заказом.
      // Водитель — в кабинет, где выплаты настраиваются после проверки документов.
      navigate('/driver');
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Ошибка регистрации');
    }
  };

  const onRoleChange = ({ onChange, role }) => {
    onChange(role);
    if (role == 'driver') {
      navigate('/driver-register');
    } else if (role == 'passenger') {
      navigate('/passenger-register');
    }
  };

  return (
    <AuthLayout title="Создать аккаунт" subtitle="Поехали!">
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

        <fieldset className={styles.docsSection}>
          <legend className={styles.docsTitle}>Документы водителя</legend>
          <p className={styles.docsSub}>
            Три документа обязательны для проверки. Форматы: JPG, PNG, PDF до
            10 МБ.
          </p>
          {DOC_FIELDS.map(({ key, label, hint }) => (
            <DocumentUpload
              key={key}
              label={label}
              hint={hint}
              file={driverDocs?.[key] ?? null}
              error={errors.driverDocuments?.[key]?.message}
              onChange={(file) =>
                setValue(`driverDocuments.${key}`, file ?? undefined, {
                  shouldValidate: true,
                  shouldDirty: true,
                })
              }
            />
          ))}
        </fieldset>

        <label className={styles.checkbox}>
          <input type="checkbox" {...register('acceptTerms')} />
          <span>
            Я принимаю <a href="/terms">условия использования</a>
          </span>
        </label>
        {errors.acceptTerms && (
          <p className={styles.fieldError}>{errors.acceptTerms.message}</p>
        )}

        {serverError && <p className={styles.formError}>{serverError}</p>}

        <button
          type="submit"
          className={`${styles.btn} ${styles.btnPrimary}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Создаём…' : 'Зарегистрироваться'}
        </button>

        <p className={styles.footer}>
          Уже есть аккаунт? <Link to="/driver-login">Войти</Link>
        </p>
      </form>
    </AuthLayout>
  );
}