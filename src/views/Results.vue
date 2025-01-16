<script lang="ts" setup>
import { computed } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import type { Party, Question } from '../content.config'
import { partyNames, useStore } from '../store'
import IconChart from '~icons/material-symbols/bar-chart-4-bars-rounded'
import IconScale from '~icons/material-symbols/balance-rounded'
import IconComment from '~icons/material-symbols/comment-outline-rounded'
import ResultMatches from '../components/ResultMatches.vue'
import ResultComparison from '../components/ResultComparison.vue'
import ResultComments from '../components/ResultComments.vue'

const props = defineProps<{
  questions: Question[]
}>()

const { answers, answerCount } = useStore()

const partyMatches = computed(() => {
  const results: Record<Party, number> = {
    spd: 0,
    cdu: 0,
    fdp: 0,
    gruene: 0,
    bsw: 0,
    linke: 0,
    afd: 0,
  }

  let denominator = 0

  for (const question of props.questions) {
    const { answer: userAnswer, weight } = answers.value[question.id] ?? {}
    if (!userAnswer) continue

    for (const { answer: partyAnswer, party } of question.answers) {
      if (userAnswer === partyAnswer) {
        results[party] += weight
      }
    }

    denominator += weight
  }

  console.log(answerCount.value, denominator)

  return Object.entries(results)
    .map(([party, score]) => ({
      party: partyNames[party as Party],
      score,
      percentage: (score / denominator) * 100,
    }))
    .sort((a, b) => b.score - a.score)
})
</script>

<template>
  <div>
    <TabGroup>
      <TabList class="flex rounded-t-lg bg-blue-900/50 p-1 space-x-1">
        <Tab as="template" v-slot="{ selected }">
          <button class="tab-button" :class="{ selected: selected }">
            <IconChart />
            Ergebnis
          </button>
        </Tab>
        <Tab as="template" v-slot="{ selected }">
          <button class="tab-button" :class="{ selected: selected }">
            <IconScale />
            Parteienvergleich
          </button>
        </Tab>
        <Tab as="template" v-slot="{ selected }">
          <button class="tab-button" :class="{ selected: selected }">
            <IconComment />
            Begründungen
          </button>
        </Tab>
      </TabList>
      <TabPanels class="bg-white">
        <TabPanel>
          <ResultMatches :partyMatches="partyMatches" />
        </TabPanel>
        <TabPanel>
          <ResultComparison :questions="questions" />
        </TabPanel>
        <TabPanel><ResultComments :questions="questions" /></TabPanel>
      </TabPanels>
    </TabGroup>
  </div>
</template>

<style scoped>
.tab-button {
  @apply flex flex-col md:flex-row justify-center items-center flex-1 w-full py-2;
  @apply bg-transparent text-white text-xs md:text-xl border-2 border-transparent rounded;
  @apply focus:ring focus:ring-blue-900 outline-none motion-safe:transition duration-200;
}

.tab-button:deep(svg) {
  @apply max-md:w-8 max-md:h-8 md:me-1;
}

.tab-button.selected {
  @apply bg-white text-blue-800;
}

.tab-button:not(.selected) {
  @apply border-white;
}
</style>
