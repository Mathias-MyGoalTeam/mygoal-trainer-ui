<script setup lang="ts">
// Dashboard preview only: the entries come from the shared store and do not
// provide conversation or message-sending behavior.
//
// Avatars are placeholders only: missing `avatarUrl` falls back to the same
// generic placeholder image used in AthleteOverviewWidget - a stand-in
// until real profile images exist, no upload/handling here.
import { computed } from 'vue'
import { useGettext } from 'vue3-gettext'

import avatarPlaceholder from '@/assets/img/avatar-placeholder.png'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import { DASHBOARD_WIDGET_PREVIEW_LIMIT } from '@/composables/dashboardWidgetPreview'
import { useDashboardStore } from '@/stores/dashboard'

defineOptions({ name: 'MessagesWidget' })

const { $gettext } = useGettext()
const dashboardStore = useDashboardStore()

const messageCount = computed(() => dashboardStore.summary?.recentMessagesCount)

// Capped to the shared dashboard preview limit so this list is never longer
// than its siblings (Athlete Overview, Pending Video Reviews, Today's
// Activities) - see dashboardWidgetPreview.ts.
const visibleMessages = computed(() =>
  dashboardStore.recentMessages.slice(0, DASHBOARD_WIDGET_PREVIEW_LIMIT),
)

// Fills the list up to the shared preview limit with empty placeholder
// slots when fewer messages exist than the limit, so the card reaches the
// same height as its siblings even with a short list.
const placeholderCount = computed(() =>
  visibleMessages.value.length === 0
    ? 0
    : DASHBOARD_WIDGET_PREVIEW_LIMIT - visibleMessages.value.length,
)
</script>

<template>
  <BaseCard class="messages">
    <h2 class="messages__title">{{ $gettext('Nachrichten') }}</h2>

    <p v-if="messageCount !== undefined" class="messages__count">{{ messageCount }}</p>
    <p v-else-if="dashboardStore.isLoading" class="messages__count messages__count--loading">
      {{ $gettext('Lädt…') }}
    </p>

    <ul v-if="visibleMessages.length > 0" class="messages__list">
      <li v-for="message in visibleMessages" :key="message.id" class="messages__item">
        <span class="messages__avatar" aria-hidden="true">
          <img class="messages__avatar-img" :src="message.avatarUrl ?? avatarPlaceholder" alt="" />
        </span>
        <span class="messages__content">
          <span class="messages__athlete">{{ message.athleteName }}</span>
          <span class="messages__preview">{{ message.preview }}</span>
        </span>
        <span class="messages__timestamp">{{ message.timestamp }}</span>
      </li>
      <li
        v-for="n in placeholderCount"
        :key="`placeholder-${n}`"
        class="messages__item messages__item--placeholder"
        aria-hidden="true"
      />
    </ul>

    <!-- Non-functional placeholder until a full conversation view exists. -->
    <BaseButton variant="text" size="small" class="messages__view-all" disabled>
      {{ $gettext('Alle anzeigen') }}
    </BaseButton>
  </BaseCard>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.messages__title {
  @include typo('h2', $font-family-base, $font-weight-semibold);
  margin: 0;
  color: $color-neutral-900;
}

.messages__count {
  @include typo('h1', $font-family-base, $font-weight-bold);
  margin: $space-8 0 0;
  color: $color-orange-600;
}

.messages__count--loading {
  @include typo('body', $font-family-base, $font-weight-regular);
  color: $color-neutral-400;
}

.messages__list {
  list-style: none;
  margin: $space-16 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: $space-12;
}

.messages__item {
  display: flex;
  align-items: center;
  gap: $space-12;
  min-width: 0;
  min-height: $space-48;
}

.messages__item--placeholder {
  visibility: hidden;
}

.messages__avatar {
  width: 36px;
  height: 36px;
  border-radius: $radius-circled;
  flex-shrink: 0;
  overflow: hidden;
  background: $color-neutral-50;
}

.messages__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.messages__content {
  display: flex;
  flex-direction: column;
  gap: $space-4;
  min-width: 0;
  flex: 1;
}

.messages__athlete {
  @include typo('body', $font-family-base, $font-weight-semibold);
  color: $color-neutral-900;
}

.messages__preview {
  @include typo('small', $font-family-base, $font-weight-regular);
  color: $color-neutral-500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.messages__timestamp {
  @include typo('small', $font-family-base, $font-weight-regular);
  color: $color-neutral-500;
  flex-shrink: 0;
}

.messages__view-all {
  margin-top: $space-8;
  padding-left: 0;
}
</style>
