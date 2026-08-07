import { BreadcrumbItem } from '@/shared/components/Breadcrumbs/Breadcrumbs';

const PREDICTIONS_BASE = '/predictions';
const PRODUCTS_BASE = '/products';

const productsRoutes: { [key: string]: BreadcrumbItem } = {
  bread: {
    href: `${PRODUCTS_BASE}/bread`,
    label: 'Bread',
  },
};

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
  contact: {
    href: '/service/contact',
    label: 'Contact us',
  },
  privacy: {
    href: '/privacy',
    label: 'Privacy Policy',
  },
  predictions: {
    href: `${PREDICTIONS_BASE}`,
    label: 'Predictions',
  },
  apiCompetition: {
    href: `${PREDICTIONS_BASE}/competition/:id`,
    label: 'API Competition',
  },
  myGroups: {
    href: `${PREDICTIONS_BASE}/groups`,
    label: 'My Groups',
  },
  group: {
    href: `${PREDICTIONS_BASE}/groups/:id`,
    label: 'Group',
  },
  tournament: {
    href: `${PREDICTIONS_BASE}/tournament/:tournamentID`,
    label: 'Tournament',
  },
  availableTournaments: {
    href: `${PREDICTIONS_BASE}/tournament/available`,
    label: 'Available tournaments',
  },
  joinGroup: {
    href: `${PREDICTIONS_BASE}/groups/join/`,
    label: 'Join group',
  },

  ...productsRoutes,
};
