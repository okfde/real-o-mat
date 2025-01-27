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
  <div class="bg-white p-4 md:p-8">
    <h2>Begründung der Thesen</h2>
    <p class="mb-6">
      Wie begründen die Parteien ihre Positionen? Wählen Sie eine These aus und
      finden Sie heraus, warum die Parteien zustimmen oder ablehnen.
    </p>

    <hr class="border-gray-200" />

    <nav class="grid-r mt-6 grid grid-cols-3 justify-center">
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
          class="w-24 rounded-md border-gray-300 bg-purple-100 px-4 py-1 shadow-sm outline-none focus:ring-3 focus:ring-purple-600/50 motion-safe:transition"
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

    <Transition mode="out-in" :name="transitionName">
      <article :key="currentQuestionIndex">
        <h3 class="my-8 text-xl font-medium md:text-2xl">
          {{ currentQuestion.thesis }}
        </h3>
        <ul class="mt-8 grid gap-4 md:grid-cols-2">
          <Disclosure
            as="li"
            v-slot="{ open }"
            v-for="({ party, comment }, i) in currentQuestion.answers"
            :key="party"
            class="flex flex-col"
          >
            <DisclosureButton
              class="flex w-full items-center justify-between rounded bg-purple-100 px-4 py-2 outline-none focus:ring-3 focus:ring-purple-600/50 motion-safe:transition"
              :class="{ 'rounded-b-none': open }"
            >
              <h4 class="text-lg">{{ partyNames[party] }}</h4>
              <IconChevron
                aria-hidden="true"
                class="h-5 w-5 transform text-purple-900 motion-safe:transition-transform"
                :class="{
                  'rotate-180': open,
                }"
              />
            </DisclosureButton>
            <DisclosurePanel class="flex-1 rounded-b-lg bg-purple-50 p-4">
              <div class="comment" v-if="comment" v-html="comment" />
              <em v-else>keine Begründung angegeben</em>
            </DisclosurePanel>
          </Disclosure>
        </ul>
      </article>
    </Transition>
  </div>
</template>

<style scoped>
@reference "../assets/style.css";

.comment:deep(a) {
  @apply text-purple-600 underline hover:text-purple-700;
}
</style>
