import type { UserRole } from '../types/auth';
import styles from './RoleSwitcher.module.css';

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
    <div className={styles.root} role="tablist" aria-label="Роль">
      {ROLES.map((r) => (
        <button
          key={r.value}
          type="button"
          role="tab"
          aria-selected={value === r.value}
          className={`${styles.item} ${value === r.value ? styles.active : ''}`}
          onClick={() => onChange(r.value)}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}