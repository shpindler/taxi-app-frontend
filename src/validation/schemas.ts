import { z } from 'zod';

const phoneRegex = /^\+?[0-9]{10,15}$/;

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

function fileSchema(label: string) {
  return z
    .instanceof(File, { message: `Загрузите ${label}` })
    .refine((f) => f.size <= MAX_SIZE, {
      message: `Файл ${label} больше 10 МБ`,
    })
    .refine((f) => ACCEPTED_TYPES.includes(f.type), {
      message: `Формат ${label}: JPG, PNG или PDF`,
    });
}

export const loginSchema = z.object({
  login: z.string().trim().regex(phoneRegex, 'Введите корректный номер телефона'),
  password: z.string().min(6, 'Минимум 6 символов'),
  role: z.enum(['passenger', 'driver']),
});

export const driverRegisterSchema = z
  .object({
    name: z.string().trim().min(2, 'Введите имя'),
    phone: z.string().trim().regex(phoneRegex, 'Введите корректный номер телефона'),
    email: z.string().trim().email('Некорректный email'),
    password: z
      .string()
      .min(8, 'Минимум 8 символов')
      .regex(/[A-Z]/, 'Нужна хотя бы одна заглавная буква')
      .regex(/[0-9]/, 'Нужна хотя бы одна цифра'),
    confirmPassword: z.string(),
    role: z.enum(['passenger', 'driver']),
    acceptTerms: z.literal(true, { error: 'Необходимо принять условия' }),
    driverDocuments: z
      .object({
        license: fileSchema('водительские права'),
        vehicleRegistration: fileSchema('СТС'),
        taxiRegistry: fileSchema('выписку из реестра такси'),
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Пароли не совпадают',
  })
  .superRefine((data, ctx) => {
    const docs = data.driverDocuments;
    const required: { key: keyof typeof docs; label: string }[] = [
      { key: 'license', label: 'Водительские права' },
      { key: 'vehicleRegistration', label: 'СТС автомобиля' },
      { key: 'taxiRegistry', label: 'Выписку из реестра такси' },
    ];
    for (const { key, label } of required) {
      if (!docs[key]) {
        ctx.addIssue({
          path: ['driverDocuments', key],
          code: 'custom',
          message: `Загрузите ${label.toLowerCase()}`,
        });
      }
    }
  });

export const passengerRegisterSchema = z
  .object({
    name: z.string().trim().min(2, 'Введите имя'),
    phone: z.string().trim().regex(phoneRegex, 'Введите корректный номер телефона'),
    email: z.string().trim().email('Некорректный email'),
    password: z
      .string()
      .min(8, 'Минимум 8 символов')
      .regex(/[A-Z]/, 'Нужна хотя бы одна заглавная буква')
      .regex(/[0-9]/, 'Нужна хотя бы одна цифра'),
    confirmPassword: z.string(),
    role: z.enum(['passenger', 'driver']),
    acceptTerms: z.literal(true, { error: 'Необходимо принять условия' }),
    driverDocuments: z
      .object({
        license: fileSchema('водительские права').optional(),
        vehicleRegistration: fileSchema('СТС').optional(),
        taxiRegistry: fileSchema('выписку из реестра такси').optional(),
      })
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Пароли не совпадают',
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type DriverRegisterFormValues = z.infer<typeof driverRegisterSchema>;
export type PassengerRegisterFormValues = z.infer<typeof passengerRegisterSchema>;