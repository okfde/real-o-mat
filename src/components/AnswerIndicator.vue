<script setup lang="ts">
import Popper from 'vue3-popper'
import type { Answer } from '../content.config'
import IconLess from '~icons/material-symbols/stat-minus-2-rounded'
import IconMore from '~icons/material-symbols/stat-2-rounded'
import IconRight from '~icons/material-symbols/check-rounded'
import IconUnknown from '~icons/material-symbols/shield-question-outline-rounded'
import IconNeutral from '~icons/material-symbols/circle-outline'
import { answerLabels } from '../store'

defineProps<{
  answer: Answer
}>()

const styles: Record<Answer, any> = {
  'zu weit': { icon: IconLess, class: 'bg-red-500' },
  richtig: { icon: IconRight, class: 'bg-green-500' },
  'nicht weit genug': { icon: IconMore, class: 'bg-orange-500' },
  '/': { icon: IconUnknown, class: 'bg-gray-600' },
  '-': { icon: IconNeutral, class: 'bg-gray-700' },
}
</script>

<template>
  <Popper arrow hover placement="top" :content="answerLabels[answer]">
    <div
      class="w-8 h-8 text-white rounded-full flex items-center justify-center"
      :class="[styles[answer].class]"
    >
      <component :is="styles[answer].icon" class="w-6 h-6" />
    </div>
  </Popper>
</template>
