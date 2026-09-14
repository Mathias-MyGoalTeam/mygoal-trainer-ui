import type { RouteRecordRaw } from 'vue-router'

// Every route below sets `meta.requiredPermission` so PermissionGuard.vue
// (wired into App.vue's RouterView) has something to check per route. All
// permissions currently always resolve to "allowed" (see permissions.ts) -
// this is structural scaffolding for the future RBAC system, not real
// access control yet (S04-T3).
export const routes: RouteRecordRaw[] = [
  {
    // Temporary landing route: there is no login/auth flow yet in Mocked
    // Mode, so the app always lands on the dashboard.
    path: '/',
    redirect: '/dashboard',
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
  },
  {
    path: '/athletes',
    name: 'athletes',
    component: () => import('@/views/Athletes.vue'),
    meta: { requiredPermission: 'athletes:view' },
  },
  {
    // Sub-route of /athletes - the only page pair in this batch with a
    // natural parent/child structure, hence the only one using Breadcrumb.
    path: '/athletes/:id',
    name: 'athlete-detail',
    component: () => import('@/views/AthleteProfile.vue'),
    meta: { requiredPermission: 'athletes:view' },
  },
  {
    path: '/training-plans',
    name: 'training-plans',
    component: () => import('@/views/TrainingPlans.vue'),
    meta: { requiredPermission: 'training-plans:view' },
  },
  {
    path: '/video-review',
    name: 'video-review',
    component: () => import('@/views/VideoReview.vue'),
    meta: { requiredPermission: 'video-review:view' },
  },
  {
    path: '/messages',
    name: 'messages',
    component: () => import('@/views/Messages.vue'),
    meta: { requiredPermission: 'messages:view' },
  },
  {
    path: '/appointments',
    name: 'appointments',
    component: () => import('@/views/Appointments.vue'),
    meta: { requiredPermission: 'appointments:view' },
  },
  {
    path: '/billing',
    name: 'billing',
    component: () => import('@/views/Billing.vue'),
    meta: { requiredPermission: 'billing:view' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/Settings.vue'),
    meta: { requiredPermission: 'settings:view' },
  },
]
