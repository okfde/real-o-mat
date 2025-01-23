<script setup lang="ts">
import Popper from 'vue3-popper'
import type { Answer } from '../content.config'
import IconLess from '~icons/material-symbols/stat-minus-2-rounded'
import IconMore from '~icons/material-symbols/stat-2-rounded'
import IconRight from '~icons/material-symbols/check-rounded'
import IconUnknown from './IconUnknown.vue'
import IconNeutral from '~icons/material-symbols/circle-outline'
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
  '-': { icon: IconNeutral, class: 'bg-gray-700' },
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
      class="w-10 h-10 text-white rounded-full flex items-center justify-center"
      :class="[styles[answer].class]"
      v-bind="$attrs"
      :aria-label="answerLabels[answer]"
    >
      <component :is="styles[answer].icon" class="w-7 h-7" aria-hidden="true" />
    </div>
  </Popper>
</template>
