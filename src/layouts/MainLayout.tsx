import { Link, Outlet } from 'react-router-dom';
import styles from './MainLayout.module.css';

export function MainLayout() {
  return (
    <>
      <div className={styles.strip} aria-hidden />
      <header className={styles.header}>
        <Link to="/compare" className={styles.logo}>
          🚕 <span>TaxiGo</span>
        </Link>
        <nav className={styles.nav}>
          <Link to="/compare">Сравнить</Link>
          <Link to="/login">Войти</Link>
        </nav>
      </header>
      <Outlet />
    </>
  );
}