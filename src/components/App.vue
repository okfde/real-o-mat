<script lang="ts" setup>
import { ref } from 'vue'
import Questionnaire from './Questionnaire.vue'
import Results from './Results.vue'
import Weights from './Weights.vue'
import type { Question } from '../content.config'
import { answers, currentQuestionIndex, stage } from '../store'

const props = defineProps<{
  questions: Question[]
}>()

const reset = () => {
  answers.value = {}
  currentQuestionIndex.value = 0
  stage.value = 'intro'
}
</script>

<template>
  <div v-if="stage === 'intro'" class="bg-white py-8 px-4">
    <h2 class="text-xl mb-6">Herzlich Willkommen beim Real-O-Mat!</h2>

    <button class="btn text-4xl" @click="stage = 'questionnaire'">
      Los geht's!
    </button>
  </div>

  <Questionnaire
    v-else-if="stage === 'questionnaire'"
    :questions="questions"
    @done="stage = 'weights'"
    @reset="reset"
  />

  <Weights
    v-else-if="stage === 'weights'"
    :questions="questions"
    @done="stage = 'results'"
  />

  <Results v-else :questions="questions" @reset="reset" />
</template>
