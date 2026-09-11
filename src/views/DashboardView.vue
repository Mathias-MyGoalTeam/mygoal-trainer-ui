<script setup lang="ts">
import { computed, onMounted } from 'vue'

import TrainerSummaryCard from '@/components/TrainerSummaryCard.vue'
import { useViewport } from '@/composables/useViewport'
import { getDictionary } from '@/language'
import { useSessionStore } from '@/stores/session'
import { useTrainerStore } from '@/stores/trainer'

const sessionStore = useSessionStore()
const trainerStore = useTrainerStore()
const viewport = useViewport()

const dictionary = computed(() => getDictionary(sessionStore.locale))

onMounted(async () => {
  await trainerStore.loadDashboard()
})
</script>

<template>
  <main class="dashboard-view">
    <section class="dashboard-view__header">
      <div>
        <p class="dashboard-view__mode">{{ dictionary.mockedMode }}</p>
        <h1>{{ dictionary.dashboardTitle }}</h1>
        <p>{{ dictionary.dashboardSubtitle }}</p>
      </div>
      <div class="dashboard-view__meta">
        <strong>{{ sessionStore.appName }}</strong>
        <span>{{ dictionary.viewport }}: {{ viewport.label }}</span>
      </div>
    </section>

    <TrainerSummaryCard
      v-if="trainerStore.profile"
      :profile="trainerStore.profile"
      :assigned-users-count="trainerStore.assignedUsers.length"
      :eyebrow="dictionary.trainerLabel"
      :summary-text="dictionary.mockedSummary"
    />

    <section class="dashboard-view__users">
      <h2>{{ dictionary.assignedUsers }}</h2>
      <p v-if="trainerStore.isLoading">{{ dictionary.loading }}</p>
      <ul v-else>
        <li v-for="user in trainerStore.assignedUsers" :key="user.id">
          <strong>{{ user.displayName }}</strong>
          <span>{{ user.trainingFocus }}</span>
          <small>{{ dictionary.nextSession }}: {{ user.nextSessionDate }}</small>
        </li>
      </ul>
    </section>
  </main>
</template>

<style scoped>
.dashboard-view {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem 3rem;
}

.dashboard-view__header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.dashboard-view__mode {
  margin: 0 0 0.5rem;
  color: #059669;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.dashboard-view__meta {
  display: grid;
  gap: 0.25rem;
  align-content: start;
}

.dashboard-view__users {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

ul {
  display: grid;
  gap: 1rem;
  padding: 0;
  margin: 1rem 0 0;
  list-style: none;
}

li {
  display: grid;
  gap: 0.25rem;
}
</style>
