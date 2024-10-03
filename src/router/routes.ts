import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },
  {
    path: '/main',
    component: () => import('layouts/DashboardLayout.vue'),
    children: [{ path: '', component: () => import('components/MessagePanel.vue') }],
  },
  {
    path: '/login',
    children: [{ path: '', component: () => import('pages/LoginPage.vue') }],
  },
  {
    path: '/signup',
    children: [{ path: '', component: () => import('pages/SignUp.vue') }],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
