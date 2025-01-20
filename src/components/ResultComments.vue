<script setup lang="ts">
import { computed, ref } from 'vue'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import type { Question } from '../content.config'
import IconBack from '~icons/material-symbols/arrow-back'
import IconForward from '~icons/material-symbols/arrow-forward'
import IconChevron from '~icons/material-symbols/keyboard-arrow-down-rounded'
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
  <div class="bg-white p-4">
    <h2>Begründung der Thesen</h2>
    <p class="mt-4 mb-6">
      Wie begründen die Parteien ihre Positionen? Wählen Sie eine These aus und
      finden Sie heraus, warum die Parteien zustimmen oder ablehnen.
    </p>

    <hr class="border-gray-200" />

    <nav class="grid grid-cols-3 grid-r mt-6 justify-center">
      <button
        @click="previousQuestion"
        :disabled="currentQuestionIndex === 0"
        class="btn-text justify-self-start"
      >
        <IconBack aria-hidden="true" class="me-1" />
        Zurück
      </button>
      <div class="text-center">
        <select
          class="rounded-md bg-blue-100 px-4 py-1 w-24 border-gray-300 shadow-sm focus:ring focus:ring-blue-600/50 outline-none motion-safe:transition"
          v-model="currentQuestionIndex"
          aria-label="Springe zur These"
          @change="transitionName = undefined"
        >
          <option
            v-for="(question, index) in props.questions"
            :key="index"
            :value="index"
          >
            These {{ index + 1 }}: {{ question.thesis }}
          </option>
        </select>
      </div>
      <button
        @click="nextQuestion"
        class="btn-text justify-self-end"
        :disabled="currentQuestionIndex === props.questions.length - 1"
      >
        Weiter
        <IconForward aria-hidden="true" class="me-1" />
      </button>
    </nav>

    <article>
      <h3 class="text-xl md:text-2xl my-8 font-medium">
        {{ currentQuestion.thesis }}
      </h3>
      <ul class="mt-8 grid md:grid-cols-2 gap-4">
        <Disclosure
          as="li"
          v-slot="{ open }"
          v-for="({ party, comment }, i) in currentQuestion.answers"
          :key="party"
          class="flex flex-col"
        >
          <DisclosureButton
            class="flex w-full justify-between items-center rounded bg-blue-100 px-4 py-2 focus:ring focus:ring-blue-600/50 outline-none motion-safe:transition"
            :class="{ 'rounded-b-none': open }"
          >
            <h4 class="text-lg">{{ partyNames[party] }}</h4>
            <IconChevron
              aria-hidden="true"
              class="h-5 w-5 text-blue-900 transform motion-safe:transition-transform"
              :class="{
                'rotate-180': open,
              }"
            />
          </DisclosureButton>
          <DisclosurePanel class="p-4 bg-blue-50 rounded-b-lg flex-1">
            <div class="comment" v-if="comment" v-html="comment" />
            <em v-else>keine Begründung angegeben</em>
          </DisclosurePanel>
        </Disclosure>
      </ul>
    </article>
  </div>
</template>

<style scoped>
.comment:deep(a) {
  @apply text-blue-600 hover:text-blue-700 underline;
}
</style>
