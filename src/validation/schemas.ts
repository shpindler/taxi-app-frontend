import { z } from 'zod';

const phoneRegex = /^\+?[0-9]{10,15}$/;

export const loginSchema = z.object({
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Введите корректный номер телефона'),
  password: z
    .string()
    .min(6, 'Минимум 6 символов'),
  role: z.enum(['passenger', 'driver']),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, 'Введите имя'),
    phone: z
      .string()
      .trim()
      .regex(phoneRegex, 'Введите корректный номер телефона'),
    email: z.string().trim().email('Некорректный email'),
    password: z
      .string()
      .min(8, 'Минимум 8 символов')
      .regex(/[A-Z]/, 'Нужна хотя бы одна заглавная буква')
      .regex(/[0-9]/, 'Нужна хотя бы одна цифра'),
    confirmPassword: z.string(),
    role: z.enum(['passenger', 'driver']),
    acceptTerms: z.boolean().refine((val) => val === true, {
      error: 'Необходимо принять условия',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Пароли не совпадают',
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;