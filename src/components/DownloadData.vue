<script lang="ts" setup>
import { computed } from 'vue'
import type { Election } from '../content.config'
import IconDownload from '~icons/material-symbols/download-rounded'

const props = defineProps<{
  election: Election
}>()

const blob = computed(() => {
  const data = JSON.stringify({
    timestamp: new Date(),
    data: props.election,
  })

  const blob = new Blob([data], { type: 'application/json' })
  return URL.createObjectURL(blob)
})
</script>

<template>
  <a class="btn" :href="blob" :download="`real-o-mat-${election.slug}.json`">
    <IconDownload aria-hidden="true" class="me-1" />
    Daten herunterladen
  </a>
</template>
