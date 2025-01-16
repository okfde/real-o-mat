<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Question } from '../content.config'
import IconBack from '~icons/material-symbols/arrow-back'
import IconForward from '~icons/material-symbols/arrow-forward'
import { partyNames } from '../store'

const currentQuestionIndex = ref(0)
const currentQuestion = computed(
  () => props.questions[currentQuestionIndex.value],
)

const transitionName = ref<string | undefined>('slide')

const previousQuestion = () => {
  transitionName.value = 'slide-back'
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const nextQuestion = () => {
  transitionName.value = 'slide'

  if (currentQuestionIndex.value < props.questions.length - 1) {
    currentQuestionIndex.value++
  }
}

const props = defineProps<{
  questions: Question[]
}>()
</script>

<template>
  <div class="p-4">
    <h2 class="text-4xl font-medium">Begründung der Thesen</h2>
    <p class="mt-4 mb-6">
      Wie begründen die Parteien ihre Positionen? Wählen Sie eine These aus und
      finden Sie heraus, warum die Parteien zustimmen oder ablehnen.
    </p>

    <hr class="border-gray-200" />

    <nav class="grid grid-cols-3 grid-r mt-6 justify-center">
      <button
        @click="previousQuestion"
        :disabled="currentQuestionIndex === 0"
        class="btn-text"
      >
        <IconBack class="me-1" />
        Zurück
      </button>
      <div class="text-center">
        <select
          class="rounded-md bg-blue-100 px-4 py-1 border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          v-model="currentQuestionIndex"
          @change="transitionName = undefined"
        >
          <option
            v-for="(question, index) in props.questions"
            :key="index"
            :value="index"
          >
            These {{ index + 1 }}
          </option>
        </select>
      </div>
      <button
        @click="nextQuestion"
        class="btn-text justify-self-end"
        :disabled="currentQuestionIndex === props.questions.length - 1"
      >
        Weiter
        <IconForward class="me-1" />
      </button>
    </nav>

    <Transition :name="transitionName" mode="out-in">
      <article :key="currentQuestionIndex">
        <h3 class="text-xl md:text-2xl my-8 font-medium">
          {{ currentQuestion.thesis }}
        </h3>
        <ul class="mt-8 grid md:grid-cols-2 gap-4">
          <li
            v-for="({ party, comment }, i) in currentQuestion.answers"
            :key="party"
            class="flex flex-col"
          >
            <div
              class="flex w-full justify-between items-center rounded-t-lg bg-blue-100 px-4 py-2"
            >
              <h4 class="text-lg">{{ partyNames[party] }}</h4>
            </div>
            <div class="p-4 bg-blue-50 rounded-b-lg flex-1">
              <div class="comment" v-if="comment" v-html="comment" />
              <em v-else>keine Begründung angegeben</em>
            </div>
          </li>
        </ul>
      </article>
    </Transition>
  </div>
</template>

<style scoped>
.comment:deep(a) {
  @apply text-blue-600 underline;
}
</style>
