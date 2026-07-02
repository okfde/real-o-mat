<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import { publicUrl, shareResultTitle, shareResultEmojiFilled, shareResultEmojiEmpty } from '../const'
import IconShare from '~icons/material-symbols/ios-share-rounded'

const props = defineProps<{
  partyMatches: { party: string; percentage: number }[]
}>()

const barCells = 8

const shareResultText = computed(() => {
  const lines = props.partyMatches.map(({ party, percentage }) => {
    const filled = Math.round((percentage / 100) * barCells)
    const bar = shareResultEmojiFilled.repeat(filled) + shareResultEmojiEmpty.repeat(barCells - filled)
    return `${bar} ${percentage}% ${party}`
  })
  return `${shareResultTitle}\n\n${lines.join('\n')}\n\n${publicUrl}`
})

const { copy, copied } = useClipboard({ copiedDuring: 2000 })
</script>

<template>
  <button class="btn" @click="copy(shareResultText)">
    <IconShare aria-hidden="true" class="me-1" />
    {{ copied ? 'Kopiert!' : 'Ihr Ergebnis teilen' }}
  </button>
</template>
