<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import Questionnaire from '../views/Questionnaire.vue'
import Results from '../views/Results.vue'
import Weights from '../views/Weights.vue'
import type { Question } from '../content.config'
import { useStore, Stage } from '../store'
import IconBack from '~icons/material-symbols/arrow-back'
import IconRestart from '~icons/material-symbols/restart-alt-rounded'

defineProps<{
  questions: Question[]
}>()

const { answers, currentQuestionIndex, currentStage } = useStore()

const transitionName = ref('slide')

const reset = () => {
  transitionName.value = 'slide-back'
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
  transitionName.value = 'slide'
  if (hasNextStage.value) currentStage.value += 1
}

const previousStage = () => {
  transitionName.value = 'slide-back'
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
  <Transition :name="transitionName" mode="out-in">
    <div v-if="currentStage === Stage.Intro" class="bg-white p-4">
      <p class="text-xl mb-4">
        Alle 7 Parteien, die in der letzten Legislaturperiode im Bundestag
        saßen, haben über Anträge und Gesetzesentwürfe abgestimmt. Jetzt sind
        Sie an der Reihe: Vergleichen Sie Ihre Standpunkte mit dem
        Abstimmungsverhalten der Parteien.
      </p>
      <p>
        Der Real-O-Mat ist keine Wahlempfehlung, sondern ein Informationsangebot
        über Parteien und ihr Abstimmungsverhalten.
      </p>
      <button class="btn text-4xl mt-4" @click="nextStage">Los geht's!</button>

      <slot />
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
    <button @click="previousStage" class="btn-text">
      <IconBack aria-hidden="true" class="me-1" />
      Zurück
    </button>

    <button @click="confirmReset" class="btn-text ms-auto">
      <IconRestart aria-hidden="true" class="me-1" />
      Neustarten
    </button>
  </div>
</template>
