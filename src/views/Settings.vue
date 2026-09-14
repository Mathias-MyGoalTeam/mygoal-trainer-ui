<script setup lang="ts">
// Route skeleton only (S04-T3, AP-01): structural placeholder for the
// future trainer profile/settings page. No data fetching or Data-Hub
// wiring here yet - that comes in a dedicated feature task.
import { useGettext } from 'vue3-gettext'

import BasePageHeader from '@/components/BasePageHeader.vue'
import BaseUnderConstruction from '@/components/BaseUnderConstruction.vue'

// Explicit multi-word name so the file can stay `Settings.vue` while
// satisfying the vue/multi-word-component-names lint rule.
defineOptions({ name: 'SettingsPage' })

const { $gettext } = useGettext()
</script>

<template>
  <div class="page">
    <BasePageHeader :title="$gettext('Profil & Einstellungen')" />
    <BaseUnderConstruction
      variant="overlay"
      :title="$gettext('Profil & Einstellungen')"
      :message="$gettext('Diese Seite befindet sich im Aufbau.')"
    />
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;

// Desktop-first layout: designed and verified for >= 1280px viewports.
// No mobile/responsive variant here by design - see docs/design-principles.md.
.page {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: $space-40 $space-24 $space-60;
  display: flex;
  flex-direction: column;
  gap: $space-32;
}
</style>
