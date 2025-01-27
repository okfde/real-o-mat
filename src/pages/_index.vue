<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import Questionnaire from '../views/Questionnaire.vue'
import Results from '../views/Results.vue'
import Weights from '../views/Weights.vue'
import type { Question } from '../content.config'
import { useStore, Stage } from '../store'
import IconBack from '~icons/material-symbols/arrow-back'
import IconForward from '~icons/material-symbols/arrow-forward'
import IconRestart from '~icons/material-symbols/restart-alt-rounded'
import FdsLogo from '../assets/fragdenstaat.svg'

defineProps<{
  questions: Question[]
}>()

const { answers, currentQuestionIndex, currentStage, viewTransition } =
  useStore()

const reset = () => {
  viewTransition.value = 'slide-back'
  answers.value = {}
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
  viewTransition.value = 'slide'
  if (hasNextStage.value) currentStage.value += 1
}

const previousStage = () => {
  viewTransition.value = 'slide-back'
  if (hasPreviousStage.value) currentStage.value -= 1
}

const beforeUnload = (event: BeforeUnloadEvent) => {
  event.preventDefault()
  event.returnValue = '' // legacy browsers
}

const updateBeforeUnload = () => {
  if ([Stage.Questionnaire, Stage.Weights].includes(currentStage.value)) {
    window.addEventListener('beforeunload', beforeUnload)
  } else {
    window.removeEventListener('beforeunload', beforeUnload)
  }
}

watch(currentStage, () => updateBeforeUnload())

onMounted(() => updateBeforeUnload())
</script>

<template>
  <Transition :name="viewTransition" mode="out-in">
    <div v-if="currentStage === Stage.Intro">
      <div class="bg-white p-8 md:p-16 md:text-center">
        <p class="text-xl font-medium md:text-2xl mb-4">
          Alle 7 Parteien, die in der letzten Legislaturperiode im Bundestag
          saßen, haben über Anträge und Gesetzesentwürfe abgestimmt. Jetzt sind
          Sie an der Reihe: Vergleichen Sie Ihre Standpunkte mit dem
          Abstimmungsverhalten der Parteien.
        </p>
        <p>
          Der Real-O-Mat ist keine Wahlempfehlung, sondern ein
          Informationsangebot über Parteien und ihr Abstimmungsverhalten.
        </p>
        <button class="btn btn-lg mt-4 start-button" @click="nextStage">
          <IconForward aria-hidden="true" class="me-1" />
          Los geht's!
        </button>

        <div class="flex md:justify-center items-end mt-8">
          <p aria-hidden="true" class="text-sm text-gray-600">
            Ein Projekt von
          </p>
          <img
            :src="FdsLogo.src"
            alt="Ein Projekt von FragDenStaat"
            class="inline-block ms-4 w-32 mt-2"
          />
        </div>
      </div>

      <div class="bg-white/50 backdrop-blur-sm text-center mt-8 p-8">
        <slot />
      </div>
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
      @previous="previousStage"
    />

    <Results v-else :questions="questions" />
  </Transition>

  <div
    class="flex mt-4 motion-safe:transition-all"
    v-if="[Stage.Weights, Stage.Results].includes(currentStage)"
  >
    <button @click="previousStage" class="btn-text !text-white">
      <IconBack aria-hidden="true" class="me-1" />
      Zurück
    </button>

    <button @click="confirmReset" class="btn-text ms-auto !text-white">
      <IconRestart aria-hidden="true" class="me-1" />
      Neustarten
    </button>
  </div>
</template>
