import type { UserRole } from '../types/auth';

interface Props {
  value: UserRole;
  onChange: (role: UserRole) => void;
}

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'passenger', label: 'Пассажир' },
  { value: 'driver', label: 'Водитель' },
];

export function RoleSwitcher({ value, onChange }: Props) {
  return (
    <div className="role-switcher" role="tablist" aria-label="Роль">
      {ROLES.map((r) => (
        <button
          key={r.value}
          type="button"
          role="tab"
          aria-selected={value === r.value}
          className={`role-switcher__item ${
            value === r.value ? 'is-active' : ''
          }`}
          onClick={() => onChange(r.value)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}