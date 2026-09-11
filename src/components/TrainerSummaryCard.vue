<script setup lang="ts">
import type { TrainerProfile } from '@/types/trainer'

defineProps<{
  profile: TrainerProfile
  assignedUsersCount: number
  eyebrow: string
  summaryText: string
}>()
</script>

<template>
  <section class="summary-card">
    <p class="summary-card__eyebrow">{{ eyebrow }}</p>
    <h1>{{ profile.firstName }} {{ profile.lastName }}</h1>
    <p>{{ profile.sport }}</p>
    <p>{{ assignedUsersCount }} {{ summaryText }}</p>
  </section>
</template>

<style scoped>
.summary-card {
  padding: 1.5rem;
  border-radius: 1rem;
  background: #ffffff;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.summary-card__eyebrow {
  margin: 0 0 0.5rem;
  color: #2563eb;
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

h1 {
  margin: 0;
  font-size: 1.75rem;
}

p {
  margin: 0.5rem 0 0;
}
</style>
