<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import { getShareResultText } from '../share'
import IconShare from '~icons/material-symbols/ios-share-rounded'
import { publicUrl } from '../const'

const props = defineProps<{
  partyMatches: { party: string; percentage: number }[]
}>()

const shareResultText = computed(() => getShareResultText(props.partyMatches))

const { copy, copied } = useClipboard({ copiedDuring: 2000 })

const shareResult = () => {
  copy(shareResultText.value)

  const shareData = {
    title: shareResultText.value,
    url: publicUrl,
  }

  if (navigator.canShare?.(shareData)) {
    navigator.share(shareData)
  }
}

</script>

<template>
  <button class="btn" @click="shareResult">
    <IconShare aria-hidden="true" class="me-1" />
    {{ copied ? 'Kopiert!' : 'Dein Ergebnis teilen' }}
  </button>
</template>
