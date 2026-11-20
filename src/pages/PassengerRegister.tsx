import { useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { TextField } from '../components/TextField';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { DocumentUpload } from '../components/DocumentUpload';
import {
  passengerRegisterSchema,
  type PassengerRegisterFormValues,
} from '../validation/schemas';
import { authApi } from '../api/auth';
import type { DriverDocumentKind } from '../types/auth';
import styles from './Login.module.css';

export function PassengerRegisterPage() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  
  // Новые состояния для процесса верификации
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);

  const { register, handleSubmit, control, setValue, getValues, formState: { errors, isSubmitting } } = useForm<PassengerRegisterFormValues>({
    // ... ваши настройки
  });

  // ... useWatch и onRoleChange

  // 1. Функция для запроса кода
  const handleSendCode = async () => {
    setVerificationError(null);
    const phone = getValues('phone');
    if (!phone) {
      setVerificationError('Сначала введите номер телефона');
      return;
    }
    setIsSendingCode(true);
    try {
      await authApi.sendSmsCode(phone); // Новый метод в вашем api
      setIsCodeSent(true);
    } catch (e) {
      setVerificationError(e instanceof Error ? e.message : 'Ошибка отправки кода');
    } finally {
      setIsSendingCode(false);
    }
  };

  // 2. Функция для проверки кода
  const handleVerifyCode = async () => {
    setVerificationError(null);
    if (!verificationCode) {
      setVerificationError('Введите код из СМС');
      return;
    }
    try {
      await authApi.verifySmsCode(getValues('phone'), verificationCode); // Новый метод
      setIsPhoneVerified(true);
    } catch (e) {
      setVerificationError(e instanceof Error ? e.message : 'Неверный код');
    }
  };

  // 3. Модифицированный onSubmit
  const onSubmit = async (values: PassengerRegisterFormValues) => {
    setServerError(null);
    
    // Блокируем отправку, если телефон не подтвержден
    if (!isPhoneVerified) {
      setServerError('Пожалуйста, подтвердите номер телефона');
      return;
    }

    try {
      // Предполагается, что бэкенд теперь ожидает флаг или токен верификации
      const { token, user } = await authApi.registerPassenger(values);
      localStorage.setItem('token', token);
      navigate('/compare');
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Ошибка регистрации');
    }
  };

  return (
    <AuthLayout title="Создать аккаунт" subtitle="Поехали!">
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* ... Controller для роли и остальные поля ... */}

        <TextField
          label="Номер телефона"
          type="tel"
          placeholder="+7 999 123-45-67"
          autoComplete="tel"
          error={errors.phone?.message}
          {...register('phone')}
        />
        
        {/* --- Блок верификации --- */}
        <div style={{ marginBottom: '16px' }}>
          {!isCodeSent ? (
            <button type="button" onClick={handleSendCode} disabled={isSendingCode}>
              {isSendingCode ? 'Отправка...' : 'Подтвердить номер'}
            </button>
          ) : (
            <div>
              <p>Код отправлен на номер {getValues('phone')}</p>
              <input
                type="text"
                placeholder="Введите код из СМС"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                disabled={isPhoneVerified}
              />
              <button type="button" onClick={handleVerifyCode} disabled={isPhoneVerified}>
                {isPhoneVerified ? 'Номер подтвержден ✓' : 'Проверить код'}
              </button>
            </div>
          )}
          {verificationError && <p className={styles.fieldError}>{verificationError}</p>}
        </div>
        {/* --- Конец блока верификации --- */}

        {/* ... Email, Пароль и остальные поля ... */}

        <button 
          type="submit" 
          className={`${styles.btn} ${styles.btnPrimary}`} 
          disabled={isSubmitting || !isPhoneVerified} // Блокируем кнопку
        >
          {isSubmitting ? 'Создаём…' : 'Зарегистрироваться'}
        </button>
        {/* ... */}
      </form>
    </AuthLayout>
  );
}