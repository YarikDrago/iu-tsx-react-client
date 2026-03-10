import { BreadcrumbItem } from '@/shared/components/Breadcrumbs/Breadcrumbs';

export const routes: { [key: string]: BreadcrumbItem } = {
  home: {
    href: '/',
    label: 'Home',
  },
  signUp: {
    href: '/signup',
    label: 'Sign Up',
  },
  login: {
    href: '/login',
    label: 'Sign In',
  },
  activate: {
    href: '/activate/:token',
    label: 'Activate',
  },
  resetPassword: {
    href: '/reset-password/:token',
    label: 'Reset Password',
  },
  settings: {
    href: '/settings',
    label: 'Settings',
  },
  predictions: {
    href: '/predictions',
    label: 'Predictions',
  },
  apiCompetition: {
    href: '/predictions/competition/:id',
    label: 'Competition',
  },
  myGroups: {
    href: '/predictions/groups',
    label: 'My Groups',
  },
  group: {
    href: '/predictions/groups/:id',
    label: 'Group',
  },
  joinGroup: {
    href: '/predictions/groups/join/',
    label: 'Join group',
  },
};
