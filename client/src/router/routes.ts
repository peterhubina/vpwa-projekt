import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () => {
      return { path: 'login' };
    },
  },
  {
    path: '/channels',
    component: () => import('layouts/DashboardLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'home', component: () => import('components/MessagePanel.vue') },
      { path: ':id', component: () => import('components/MessagePanel.vue') },
      { path: '', name: 'NoChannelOpened', component: () => import('components/NoChannelOpened.vue') },
    ],
  },
  {
    path: '/login',
    children: [{ path: '', name: 'login', meta: { guestOnly: true }, component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/signup',
    children: [{ path: '', name: 'signup', meta: { guestOnly: true }, component: () => import('pages/SignUp.vue') }],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
