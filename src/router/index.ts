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
    component: () => import('@/views/DeviceManagement.vue'),
    children: [
      {
        path: ':deviceId',
        name: 'DeviceDetails',
        component: () => import('@/views/DeviceManagement.vue'),
        props: true
      }
    ]
  },
  {
    path: '/templates',
    name: 'Templates',
    component: () => import('@/views/Templates.vue'),
    children: [
      {
        path: 'new',
        name: 'CreateTemplate',
        component: () => import('@/views/Templates.vue'),
        props: true
      },
      {
        path: ':templateId',
        name: 'TemplateDetails',
        component: () => import('@/views/Templates.vue'),
        props: true
      }
    ]
  },
  {
    path: '/locations',
    name: 'Locations',
    component: () => import('@/views/Locations.vue'),
    children: [
      {
        path: 'new',
        name: 'CreateLocation',
        component: () => import('@/views/Locations.vue'),
        props: true
      },
      {
        path: ':locationId',
        name: 'LocationDetails',
        component: () => import('@/views/Locations.vue'),
        props: true
      },
      {
        path: ':locationId/edit',
        name: 'EditLocation',
        component: () => import('@/views/Locations.vue'),
        props: true
      }
    ]
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('@/views/History.vue')
  },
  ...(import.meta.env.VITE_ENABLE_ATOMIC_DOCS === 'true' ? [
    {
      path: '/atomic-docs/:pathMatch(.*)*',
      name: 'componentDocsHandler',
      component: { render: () => null }
    }
  ] : [])
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;