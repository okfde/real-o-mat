<script lang="ts" setup>
import { computed, h, ref } from 'vue'
import Questionnaire from './Questionnaire.vue'
import Results from './Results.vue'
import Weights from './Weights.vue'
import type { Question } from '../content.config'
import {
  answers,
  currentQuestionIndex,
  currentStage,
  Stage,
  weightedTopics,
} from '../store'
import IconBack from '~icons/material-symbols/arrow-back'
import IconRestart from '~icons/material-symbols/restart-alt-rounded'

const props = defineProps<{
  questions: Question[]
}>()

const reset = () => {
  answers.value = {}
  weightedTopics.value = []
  currentQuestionIndex.value = 0
  currentStage.value = Stage.Intro
}

const confirmReset = () => {
  if (window.confirm('Wirklich von vorne beginnen?')) {
    reset()
  }
}

const hasPreviousStage = computed(() => currentStage.value !== Stage.Intro)
const hasNextStage = computed(() => currentStage.value !== Stage.Results)

const nextStage = () => {
  if (hasNextStage.value) currentStage.value += 1
}

const previousStage = () => {
  if (hasPreviousStage.value) currentStage.value -= 1
}
</script>

<template>
  <div v-if="currentStage === Stage.Intro" class="bg-white p-4">
    <p class="text-xl mb-4">
      Alle 7 Parteien, die in der letzten Legislaturperiode im Bundestag saßen,
      haben über Anträge und Gesetzesentwürfe abgestimmt. Jetzt sind Sie an der
      Reihe: Vergleichen Sie Ihre Standpunkte mit dem Abstimmungsverhalten der
      Parteien.
    </p>
    <p>
      Der Real-O-Mat ist keine Wahlempfehlung, sondern ein Informationsangebot
      über Parteien und ihr Abstimmungsverhalten.
    </p>

    <button class="btn text-4xl mt-4" @click="nextStage">Los geht's!</button>
  </div>

  <Questionnaire
    v-else-if="currentStage === Stage.Questionnaire"
    :questions="questions"
    @done="nextStage"
    @previous="previousStage"
    @reset="confirmReset"
  />

  <Weights
    v-else-if="currentStage === Stage.Weights"
    :questions="questions"
    @done="nextStage"
  />

  <Results v-else :questions="questions" />

  <div
    v-if="[Stage.Weights, Stage.Results].includes(currentStage)"
    class="flex mt-4 text-blue-900"
  >
    <button @click="previousStage" class="btn-text">
      <IconBack class="me-1" />
      Zurück
    </button>

    <button @click="confirmReset" class="btn-text ms-auto">
      <IconRestart class="me-1" />
      Neustarten
    </button>
  </div>
</template>
