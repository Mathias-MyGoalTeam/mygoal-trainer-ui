// Type augmentation for the route `meta` field consumed by
// PermissionGuard.vue. Set by every route that goes through it (see
// routes.ts) - every route currently allows access in Mocked Mode
// regardless of this value (see permissions.ts) - but declared here so
// routes can set it with full type-checking, e.g.:
//
//   {
//     path: '/athletes',
//     name: 'athletes',
//     component: () => import('@/views/Athletes.vue'),
//     meta: { requiredPermission: 'athletes:view' },
//   }
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiredPermission?: string
  }
}
