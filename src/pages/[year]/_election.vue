<script lang="ts" setup>
import { computed, onMounted, ref, watch } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import Questionnaire from '../../views/Questionnaire.vue'
import Results from '../../views/Results.vue'
import Weights from '../../views/Weights.vue'
import type { Election, Question } from '../../content.config.js'
import { useStore, Stage } from '../../store.js'
import IconBack from '~icons/material-symbols/arrow-back'
import IconForward from '~icons/material-symbols/arrow-forward'
import IconRestart from '~icons/material-symbols/restart-alt-rounded'
import IconClose from '~icons/material-symbols/close-rounded'
import FdsLogo from '../../assets/fragdenstaat.svg'
import Tutorial from '../../views/Tutorial.vue'

const props = defineProps<{
  election: Election
}>()

const questions = computed(() => props.election.questions)

const { answers, currentQuestionIndex, currentStage, viewTransition } =
  useStore(props.election.slug)

const restartDialog = ref(false)

const reset = () => {
  restartDialog.value = false
  viewTransition.value = 'slide-back'
  answers.value = {}
  currentQuestionIndex.value = 0
  currentStage.value = Stage.Tutorial
}

const confirmReset = () => {
  if (window.confirm('Wirklich von vorne beginnen?')) {
    reset()
  }
}

const hasPreviousStage = computed(() => currentStage.value !== Stage.Tutorial)
const hasNextStage = computed(() => currentStage.value !== Stage.Results)

const start = () => {
  if (Object.keys(answers.value).length !== 0) {
    restartDialog.value = true
  } else {
    nextStage()
  }
}

const toLeftOff = () => {
  restartDialog.value = false

  if (Object.keys(answers.value).length === questions.value.length) {
    currentStage.value = Stage.Results
  } else {
    currentStage.value = Stage.Questionnaire
  }
}

const startOver = () => {
  reset()
  nextStage()
}

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
  <Transition :name="viewTransition" mode="out-in" :data-stage="currentStage">

    <Tutorial v-if="currentStage === Stage.Tutorial" @done="nextStage" />

    <Questionnaire v-else-if="currentStage === Stage.Questionnaire" :election="election" @done="nextStage"
      @previous="previousStage" @reset="confirmReset" />

    <Weights v-else-if="currentStage === Stage.Weights" :election="election" @done="nextStage"
      @previous="previousStage" />

    <Results v-else :election="election" />
  </Transition>

  <div class="mt-4 flex motion-safe:transition-all" v-if="[Stage.Weights, Stage.Results].includes(currentStage)">
    <button @click="previousStage" class="btn-text">
      <IconBack aria-hidden="true" class="me-1" />
      Zurück
    </button>

    <button @click="confirmReset" class="btn-text ms-auto">
      <IconRestart aria-hidden="true" class="me-1" />
      Neustarten
    </button>
  </div>

  <TransitionRoot appear :show="restartDialog" as="template">
    <Dialog as="div" @close="restartDialog = false" class="relative z-10">
      <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0" enter-to="opacity-100"
        leave="duration-200 ease-in" leave-from="opacity-100" leave-to="opacity-0">
        <div class="fixed inset-0 bg-black/25" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center">
          <TransitionChild as="template" enter="duration-300 ease-out" enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100" leave="duration-200 ease-in" leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95">
            <DialogPanel
              class="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <div class="flex">
                <DialogTitle as="h3" class="text-lg"> Los geht's! </DialogTitle>

                <button @click="restartDialog = false" class="btn-text ms-auto">
                  <IconClose aria-label="Schließen" />
                </button>
              </div>
              <div class="mt-2">
                <p>
                  Du hast den Real-O-Mat bereits begonnen. Möchtest du dort
                  weitermachen, wo du bisher aufgehört hast?
                </p>
              </div>

              <div class="mt-4 flex flex-wrap gap-4">
                <button type="button" class="btn" @click="toLeftOff">
                  Ja, weitermachen
                </button>
                <button type="button" class="btn-outline" @click="startOver">
                  Nein, von vorne beginnen
                </button>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>
