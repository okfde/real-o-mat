<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Election } from '../content.config'
import IconBack from '~icons/material-symbols/arrow-back'
import IconForward from '~icons/material-symbols/arrow-forward'
import { partyMap } from '../store'
import AnswerIndicator from '../components/AnswerIndicator.vue'
import { getPartyAnswer } from '../share'

const props = defineProps<{
  election: Election
}>()

const questions = computed(() => props.election.questions)
const partyBySlug = computed(() => partyMap(props.election.parties))

const currentQuestionIndex = ref(0)
const currentQuestion = computed(
  () => questions.value[currentQuestionIndex.value],
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

  if (currentQuestionIndex.value < questions.value.length - 1) {
    currentQuestionIndex.value++
  }
}
</script>

<template>
  <div class="bg-white p-4 md:p-8">
    <h2>Begründung der Thesen</h2>
    <p class="mb-6">
      Wie begründen die Parteien ihre Positionen? Wähle eine These aus und finde
      heraus, warum die Parteien zustimmen oder ablehnen.
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
          class="w-full rounded-md border-gray-300 bg-purple-100 px-4 py-1 shadow-sm outline-none focus:ring-3 focus:ring-purple-600/50 motion-safe:transition"
          v-model="currentQuestionIndex"
          aria-label="Springe zur These"
          @change="transitionName = undefined"
        >
          <option
            v-for="(question, index) in questions"
            :key="index"
            :value="index"
          >
            These {{ index + 1 }}: {{ question.keyword || question.thesis }}
          </option>
        </select>
      </div>
      <button
        @click="nextQuestion"
        class="btn-text justify-self-end"
        :disabled="currentQuestionIndex === questions.length - 1"
      >
        Weiter
        <IconForward aria-hidden="true" class="me-1" />
      </button>
    </nav>

    <div class="overflow-x-hidden">
      <Transition mode="out-in" :name="transitionName">
        <article :key="currentQuestionIndex">
          <h3 class="my-8 text-xl font-medium md:text-2xl">
            {{ currentQuestion.thesis }}
          </h3>
          <ul class="mt-8 grid gap-4 md:grid-cols-2">
            <li
              default-open
              v-for="({ party, comment }, i) in currentQuestion.answers"
              :key="party"
              class="flex flex-col"
            >
              <div
                class="flex w-full items-center justify-between rounded bg-purple-100 px-3 py-3 outline-none focus:ring-3 focus:ring-purple-600/50 motion-safe:transition"
                :class="{ 'rounded-b-none': open }"
              >
                <h4
                  class="flex items-center gap-3 text-lg font-medium md:text-xl"
                >
                  <AnswerIndicator
                    v-if="
                      getPartyAnswer(currentQuestion, partyBySlug.get(party)!)
                    "
                    :answer="
                      getPartyAnswer(currentQuestion, partyBySlug.get(party)!)!
                    "
                  />
                  {{ partyBySlug.get(party)?.name }}
                </h4>
              </div>
              <div class="flex-1 rounded-b-lg bg-purple-50 p-4">
                <div class="comment" v-if="comment" v-html="comment" />
                <em v-else>keine Begründung angegeben</em>
              </div>
            </li>
          </ul>
        </article>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
@reference "../assets/style.css";

.comment:deep(a) {
  @apply text-purple-600 underline hover:text-purple-700;
}
</style>
