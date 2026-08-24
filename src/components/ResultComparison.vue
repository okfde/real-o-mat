<script lang="ts" setup>
import type { Election } from '../content.config'
import { useStore, answerOptions } from '../store'
import AnswerIndicator from '../components/AnswerIndicator.vue'
import { computed, onMounted, ref, useTemplateRef } from 'vue'
import { getPartyAnswer } from '../share'

const props = defineProps<{
  election: Election
}>()

const questions = computed(() => props.election.questions)
const parties = computed(() => props.election.parties)

const { answers } = useStore(props.election.slug)

const tableContainer = useTemplateRef<HTMLTableElement>('table-container')
const tableScroll = ref(0)

onMounted(() => {
  tableContainer.value!.addEventListener('scroll', () => {
    tableScroll.value = tableContainer.value!.scrollLeft
  })
})
</script>

<template>
  <div class="bg-white p-4 md:p-8">
    <h2>Vergleich</h2>
    <p>
      Scrolle durch die Tabelle, um Deine Ergebnisse des Real-O-Mat mit den
      Positionen der Parteien zu vergleichen.
    </p>
  </div>

  <div class="relative overflow-x-auto" ref="table-container">
    <table :class="{ scrolled: tableScroll > 0 }">
      <thead>
        <tr>
          <th class="text-start">These</th>
          <th class="text-center">Deine Position</th>
          <th class="text-center" v-for="party in parties" :key="party.slug">
            {{ party.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questions" :key="question.id">
          <td>{{ question.thesis }}</td>
          <td class="text-center">
            <AnswerIndicator :answer="answers[question.id]?.answer ?? '/'" />
          </td>
          <td class="text-center" v-for="party in parties" :key="party.slug">
            <AnswerIndicator
              v-if="getPartyAnswer(question, party)"
              :answer="getPartyAnswer(question, party)!"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="bg-white p-4 md:p-8" aria-hidden="true">
    <h3 class="mb-2 text-lg">Legende</h3>
    <ul
      class="grid grid-cols-2 items-center gap-4 md:grid-cols-3 lg:grid-cols-5"
    >
      <li
        v-for="({ label }, answer) in answerOptions"
        class="flex items-center space-y-2"
      >
        <AnswerIndicator :answer="answer" :popup="false" class="me-4" />
        {{ label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
@reference "../assets/style.css";

table {
  @apply w-full;
}

td,
th {
  @apply bg-white py-4;
}

th {
  @apply font-medium;
}

td {
  @apply text-sm;
  hyphens: auto;
}

th:first-child,
td:first-child {
  @apply sticky left-0 z-10 min-w-56 ps-4 max-md:pe-4 max-md:shadow-xl md:ps-8;
}

tr:nth-child(odd) td {
  @apply bg-gray-50;
}

tr td:not(:first-child),
tr th:not(:first-child) {
  @apply min-w-28;
}
</style>
