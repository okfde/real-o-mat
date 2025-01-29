<script setup lang="ts">
import Popper from 'vue3-popper'
import type { Answer } from '../content.config'
import IconLess from '~icons/material-symbols/stat-minus-2-rounded'
import IconMore from '~icons/material-symbols/stat-2-rounded'
import IconRight from '~icons/material-symbols/check-rounded'
import IconUnknown from './IconUnknown.vue'
import { answerLabels } from '../store'

defineProps<{
  answer: Answer
  popup?: boolean
}>()

const styles: Record<Answer, any> = {
  'zu weit': { icon: IconLess, class: 'bg-primary-red' },
  richtig: { icon: IconRight, class: 'bg-primary-green' },
  'nicht weit genug': { icon: IconMore, class: 'bg-primary-orange' },
  '/': { icon: IconUnknown, class: 'bg-gray-600' },
}
</script>

<template>
  <Popper
    arrow
    hover
    placement="top"
    :content="answerLabels[answer]"
    :disabled="popup !== false"
  >
    <div
      class="flex h-10 w-10 items-center justify-center rounded-full text-white"
      :class="[styles[answer].class]"
      v-bind="$attrs"
    >
    <span class="sr-only">{{ answerLabels[answer] }}</span>
    <component :is="styles[answer].icon" class="h-7 w-7" aria-hidden="true" />
    </div>
  </Popper>
</template>
