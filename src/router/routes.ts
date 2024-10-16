import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [
      { path: '', name: 'MessagePanel', component: () => import('components/MessagePanel.vue') },
      { path: '', name: 'NoChannelOpened', component: () => import('components/NoChannelOpened.vue') },
    ],
  },
  {
    path: '/login',
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/signup',
    children: [{ path: '', component: () => import('pages/SignUp.vue') }],
  },

  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
