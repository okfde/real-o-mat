<script setup lang="ts">
import { computed } from 'vue'
import { useClipboard } from '@vueuse/core'
import { getShareResultText } from '../share'
import IconShare from '~icons/material-symbols/ios-share-rounded'

const props = defineProps<{
  partyMatches: { party: string; percentage: number }[]
}>()

const shareResultText = computed(() => getShareResultText(props.partyMatches))

const { copy, copied } = useClipboard({ copiedDuring: 2000 })
</script>

<template>
  <button class="btn" @click="copy(shareResultText)">
    <IconShare aria-hidden="true" class="me-1" />
    {{ copied ? 'Kopiert!' : 'Ihr Ergebnis teilen' }}
  </button>
</template>
