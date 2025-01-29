<script setup lang="ts">
import Popper from 'vue3-popper'
import type { Answer } from '../content.config'
import { answerOptions } from '../store'

defineProps<{
  answer: Answer
  popup?: boolean
}>()
</script>

<template>
  <Popper
    arrow
    hover
    placement="top"
    :content="answerOptions[answer].label"
    :disabled="popup !== false"
  >
    <div
      class="flex h-10 w-10 items-center justify-center rounded-full text-white"
      :class="answerOptions[answer].class"
      v-bind="$attrs"
    >
      <span class="sr-only">{{ answerOptions[answer].label }}</span>
      <component
        :is="answerOptions[answer].icon"
        class="h-7 w-7"
        aria-hidden="true"
      />
    </div>
  </Popper>
</template>
