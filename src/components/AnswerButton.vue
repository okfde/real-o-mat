<script setup lang="ts">
import Popper from 'vue3-popper'
import type { Answer } from '../content.config'

defineProps<{
  answer: Answer
  label: string
  partyAnswerExists: boolean
}>()

const emit = defineEmits<{
  save: [Answer]
}>()
</script>

<template>
  <div class="answer-button">
    <Popper
      class="light"
      :disabled="partyAnswerExists"
      arrow
      :hover="true"
      placement="top"
      content="Diese Option ist nicht verfügbar, da keine Partei so abgestimmt hat."
    >
      <button
        class="btn"
        @click="emit('save', answer)"
        :disabled="!partyAnswerExists"
      >
        <slot class="me-1" />
        {{ label }}
      </button>
    </Popper>
  </div>
</template>

<style scoped>
.answer-button {
  --popper-theme-background-color: theme(colors.gray.800);
  --popper-theme-background-color-hover: theme(colors.gray.800);
  --popper-theme-text-color: theme(colors.white);
  --popper-theme-border-width: 0px;
  --popper-theme-border-style: solid;
  --popper-theme-border-radius: theme(borderRadius.md);
  --popper-theme-padding: theme(spacing.4);
  --popper-theme-box-shadow: theme(boxShadow.sm);
}
</style>
