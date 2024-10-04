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
    children: [
      { path: '', name: 'MessagePanel', component: () => import('components/MessagePanel.vue') }, // Keep MessagePanel
      { path: '', name: 'NoChannelOpened', component: () => import('components/NoChannelOpened.vue') }, // Route for NoChannelOpen
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
  // Always leave this as last one,
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
