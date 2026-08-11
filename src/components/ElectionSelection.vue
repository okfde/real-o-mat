<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Election } from '../content.config'
import IconArchive from '~icons/material-symbols/archive-outline-rounded'
import ElectionCard from './ElectionCard.vue'

const props = defineProps<{
  elections: Election[]
}>()

const activeElections = computed(() =>
  props.elections.filter((election) => !election.archived),
)
const archivedElections = computed(() =>
  props.elections.filter((election) => election.archived),
)

const showArchive = ref(false)
</script>

<template>
  <nav class="mt-8">
    <ul class="grid gap-4 md:grid-cols-2">
      <li v-for="election in activeElections" :key="election.slug">
        <ElectionCard :election="election" />
      </li>
    </ul>

    <a v-if="archivedElections.length" class="btn-text mt-4" href="/archiv/">
      <IconArchive aria-hidden="true" class="me-1" />
      Archiv
    </a>
  </nav>
</template>
