<script setup lang="ts">
// Structural component that wraps a route's content and checks per-route
// access (RouteWrapper / PermissionGuard pattern). Currently always allows
// access - Mocked Mode has no real authentication/RBAC yet (see
// permissions.ts) - but this establishes where that check will live once
// real roles exist, so routes/components using this pattern won't need to
// change later.
//
// Wired into App.vue, wrapping every route's rendered component:
//
//   <RouterView v-slot="{ Component }">
//     <PermissionGuard>
//       <component :is="Component" />
//     </PermissionGuard>
//   </RouterView>
//
// Routes opt in to a specific check via `meta.requiredPermission` (see
// route-meta.d.ts):
//
//   { path: '/athletes', meta: { requiredPermission: 'athletes:view' }, ... }
//
// Routes without `meta.requiredPermission` (e.g. the dashboard) are still
// wrapped, but `hasPermission(undefined)` always allows access.
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useGettext } from 'vue3-gettext'

import { hasPermission } from '@/router/permissions'

defineOptions({ name: 'PermissionGuard' })

const { $gettext } = useGettext()
const route = useRoute()

const isAllowed = computed(() => hasPermission(route.meta.requiredPermission))
</script>

<template>
  <slot v-if="isAllowed" />
  <p v-else class="permission-guard__denied">
    {{ $gettext('Du hast keinen Zugriff auf diese Seite.') }}
  </p>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.permission-guard__denied {
  @include typo('body', $font-family-base, $font-weight-regular);
  padding: $space-40;
  text-align: center;
  color: $color-neutral-500;
}
</style>
