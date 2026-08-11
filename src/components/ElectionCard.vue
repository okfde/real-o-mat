<script setup lang="ts">
import IconForward from '~icons/material-symbols/arrow-forward'
import type { Election } from '../content.config'
import { computed } from 'vue'

const props = defineProps<{
  election: Election
}>()

const date = computed(() =>
  Intl.DateTimeFormat('de-DE', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(props.election.date),
)
</script>

<template>
  <a
    :href="`/${election.date.getFullYear()}/${election.slug}/`"
    class="block p-4 outline-none focus:ring-3 focus:ring-purple-600/50 active:bg-purple-900 motion-safe:transition"
    :class="[
      election.archived
        ? 'bg-purple-100 hover:bg-purple-200'
        : 'bg-purple-700 text-white hover:bg-purple-800',
    ]"
  >
    <p class="text-xl font-semibold">{{ election.title }}</p>
    <p :class="[election.archived ? 'text-gray-600' : 'text-purple-200']">
      {{ date }}
    </p>

    <div
      class="mt-4 flex items-center justify-end"
      :class="[election.archived ? 'text-purple-700' : 'text-purple-100']"
    >
      Zur Wahl
      <IconForward aria-hidden="true" class="ms-1" />
    </div>
  </a>
</template>
