<script lang="ts" setup>
import { computed, ref } from 'vue'
import type { Election } from '../content.config'
import IconForward from '~icons/material-symbols/arrow-forward'
import IconArchive from '~icons/material-symbols/archive-outline-rounded'

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
  <div class="mt-8 flex flex-col items-center gap-4">
    <a v-for="election in activeElections" :key="election.slug" class="btn btn-lg" :href="`/wahlen/${election.slug}`">
      <IconForward aria-hidden="true" class="me-1 shrink-0 max-md:mr-4" />
      {{ election.title }}
    </a>

    <button v-if="archivedElections.length" class="btn-text mt-4" :aria-expanded="showArchive"
      @click="showArchive = !showArchive">
      <IconArchive aria-hidden="true" class="me-1" />
      Archiv
    </button>

    <ul v-if="showArchive" class="flex flex-col items-center gap-3">
      <li v-for="election in archivedElections" :key="election.slug">
        <a class="btn-outline" :href="`/wahlen/${election.slug}`">
          {{ election.title }}
        </a>
      </li>
    </ul>
  </div>
</template>
