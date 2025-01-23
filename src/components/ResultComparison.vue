<script lang="ts" setup>
import type { Question } from '../content.config'
import { useStore, parties, partyNames, answerLabels } from '../store'
import AnswerIndicator from '../components/AnswerIndicator.vue'
import { onMounted, ref, useTemplateRef } from 'vue'

const { answers } = useStore()

const tableContainer = useTemplateRef<HTMLTableElement>('table-container')
const tableScroll = ref(0)

onMounted(() => {
  tableContainer.value!.addEventListener('scroll', () => {
    tableScroll.value = tableContainer.value!.scrollLeft
  })
})

defineProps<{
  questions: Question[]
}>()
</script>

<template>
  <div class="bg-white p-4 md:p-8">
    <h2>Vergleich</h2>
    <p>
      Scrollen Sie durch die Tabelle, um Ihre Ergebnisse des Real-O-Mat mit den
      Positionen der Parteien vergleichen.
    </p>
  </div>

  <div class="overflow-x-auto" ref="table-container">
    <table :class="{ scrolled: tableScroll > 0 }">
      <thead>
        <tr>
          <th class="text-start">These</th>
          <th class="text-center">Ihre Position</th>
          <th class="text-center" v-for="party in partyNames" :key="party">
            {{ party }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="question in questions" :key="question.id">
          <td>{{ question.thesis }}</td>
          <td class="text-center">
            <AnswerIndicator :answer="answers[question.id]?.answer ?? '/'" />
          </td>
          <td class="text-center" v-for="party in parties" :key="party">
            <AnswerIndicator
              :answer="question.answers.find((a) => a.party === party)!.answer"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="bg-white p-4 md:p-8" aria-hidden="true">
    <h3 class="text-lg mb-2">Legende</h3>
    <ul
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center"
    >
      <li
        v-for="(label, answer) in answerLabels"
        class="flex items-center space-y-2"
      >
        <AnswerIndicator :answer="answer" :popup="false" class="me-4" />
        {{ label }}
      </li>
    </ul>
  </div>
</template>

<style scoped>
table {
  @apply w-full;
}

td,
th {
  @apply py-4 bg-white;
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
  @apply sticky left-0 z-10 min-w-56 ps-4 md:ps-8 max-md:pe-4 max-md:shadow-xl;
}

tr:nth-child(odd) td {
  @apply bg-gray-50;
}

tr td:not(:first-child),
tr th:not(:first-child) {
  @apply min-w-28;
}
</style>
