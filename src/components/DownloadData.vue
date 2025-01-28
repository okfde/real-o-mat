<script lang="ts" setup>
import { computed } from 'vue'
import type { Question } from '../content.config'
import IconDownload from '~icons/material-symbols/download-rounded'

const props = defineProps<{
  questions: Question[]
}>()

const blob = computed(() => {
  const data = JSON.stringify({
    timestamp: new Date(),
    data: props.questions,
  })

  const blob = new Blob([data], { type: 'application/json' })
  return URL.createObjectURL(blob)
})
</script>

<template>
  <a class="btn" :href="blob" download="real-o-mat.json">
    <IconDownload aria-hidden="true" class="me-1" />
    Daten herunterladen
  </a>
</template>
