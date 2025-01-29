<script setup lang="ts">
import Popper from 'vue3-popper'
import type { Answer } from '../content.config'
import { answerOptions } from '../store'

defineProps<{
  answer: Answer
  disabled: boolean
}>()

const emit = defineEmits<{
  save: [Answer]
}>()
</script>

<template>
  <div class="answer-button" v-once>
    <Popper
      :disabled="!disabled"
      :hover="true"
      arrow
      placement="top"
      content="Diese Option ist nicht verfügbar, da keine Partei so abgestimmt hat."
    >
      <button class="btn" @click="emit('save', answer)" :disabled="disabled">
        <slot class="me-1" />
        {{ answerOptions[answer].label }}
      </button>
    </Popper>
  </div>
</template>
