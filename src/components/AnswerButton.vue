<script setup lang="ts">
import Popper from 'vue3-popper'
import type { Answer } from '../content.config'
import { answerLabels } from '../store'
import { onMounted } from 'vue';

defineProps<{
  answer: Answer
  disabled: boolean
  selected: boolean
}>()

const emit = defineEmits<{
  save: [Answer]
}>()

onMounted(() => {
  // For accessibility reason, we always want to focus the first button
  const button = document.querySelector('.answer-button button')
  button?.focus()
})
</script>

<template>
  <div class="answer-button" v-once>
    <Popper
      :disabled="!selected && !disabled"
      arrow
      :hover="true"
      placement="top"
      :content="
        selected
          ? 'Ihre Auswahl'
          : 'Diese Option ist nicht verfügbar, da keine Partei so abgestimmt hat.'
      "
    >
      <button
        class="btn"
        :class="{ 'ring-3 ring-primary-yellow': selected }"
        @click="emit('save', answer)"
        :disabled="disabled"
      >
        <slot class="me-1" />
        {{ answerLabels[answer] }}
      </button>
    </Popper>
  </div>
</template>

<style scoped>
@reference '../assets/style.css';
</style>
