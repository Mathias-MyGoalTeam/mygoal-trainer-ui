<script setup lang="ts">
import { RouterView } from 'vue-router'

import AppNavigation from '@/components/AppNavigation.vue'
import PermissionGuard from '@/router/PermissionGuard.vue'
</script>

<template>
  <AppNavigation />
  <RouterView v-slot="{ Component }">
    <PermissionGuard>
      <component :is="Component" />
    </PermissionGuard>
  </RouterView>
</template>
