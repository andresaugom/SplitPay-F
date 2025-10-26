import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'overview', title: 'SplitPay', href: paths.dashboard.splitpay, icon: 'CurrencyExchangeIcon' },
  { key: 'account', title: 'Mi cuenta', href: paths.dashboard.account, icon: 'user' },
  { key: 'contacts', title: 'Contactos', href: paths.dashboard.customers, icon: 'users' },
  { key: 'settings', title: 'Configuración', href: paths.dashboard.settings, icon: 'gear-six' },
] satisfies NavItemConfig[];