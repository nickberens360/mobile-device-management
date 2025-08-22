import { createRouter, createWebHistory } from 'vue-router';
import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/views/Dashboard.vue')
  },
  {
    path: '/configure',
    name: 'ConfigureDevices',
    component: () => import('@/views/ConfigureDevices.vue')
  },
  {
    path: '/devices',
    name: 'DeviceManagement',
    component: () => import('@/views/DeviceManagement.vue')
  },
  {
    path: '/devices/:deviceId',
    name: 'DeviceDetails',
    component: () => import('@/views/DeviceDetail.vue'),
    props: true
  },
  {
    path: '/templates',
    name: 'Templates',
    component: () => import('@/views/Templates.vue')
  },
  {
    path: '/templates/new',
    name: 'CreateTemplate',
    component: () => import('@/views/Templates.vue'),
    props: true
  },
  {
    path: '/templates/:templateId',
    name: 'TemplateDetails',
    component: () => import('@/views/TemplateDetail.vue'),
    props: true
  },
  {
    path: '/locations',
    name: 'Locations',
    component: () => import('@/views/Locations.vue')
  },
  {
    path: '/locations/new',
    name: 'CreateLocation',
    component: () => import('@/views/Locations.vue'),
    props: true
  },
  {
    path: '/locations/:locationId',
    name: 'LocationDetails',
    component: () => import('@/views/LocationDetail.vue'),
    props: true
  },
  {
    path: '/locations/:locationId/edit',
    name: 'EditLocation',
    component: () => import('@/views/LocationDetail.vue'),
    props: true
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/History.vue')
  },
  {
    path: '/login',
    name: 'Login',
    redirect: '/dashboard'
  },
  ...(import.meta.env.VITE_ENABLE_ATOMIC_DOCS === 'true' ? [
    {
      path: '/atomic-docs/:pathMatch(.*)*',
      name: 'componentDocsHandler',
      component: { render: () => null }
    }
  ] : []),
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/dashboard'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;