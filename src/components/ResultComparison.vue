<script lang="ts" setup>
import type { Question } from '../content.config'
import { useStore, parties, partyNames } from '../store'
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
  <h2 class="text-4xl font-medium">Vergleich</h2>
  <p class="mt-4">
    Scrollen Sie durch die Tabelle, um Ihre Ergebnisse des Real-O-Mat mit den
    Positionen der Parteien vergleichen.
  </p>

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
</template>

<style scoped>
td {
  @apply py-4;
}

th:first-child,
td:first-child {
  @apply sticky left-0 z-10 min-w-32 bg-white;
}

.scrolled th:first-child,
.scrolled td:first-child {
  @apply shadow-xl;
}

tr td:not(:first-child),
tr th:not(:first-child) {
  @apply min-w-24;
}
</style>
