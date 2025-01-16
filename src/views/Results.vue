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

const { answers, answerCount, weightedTopics } = useStore()

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
    const userAnswer = answers.value[question.id]?.answer
    if (!userAnswer) continue

    for (const { answer: partyAnswer, party } of question.answers) {
      if (userAnswer === partyAnswer) {
        if (weightedTopics.value.includes(question.category)) {
          results[party] += 2
        } else {
          results[party] += 1
        }
      }
    }

    denominator += weightedTopics.value.includes(question.category) ? 2 : 1
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
      <TabList class="flex rounded-t-lg bg-blue-900/50 p-1">
        <Tab as="template" v-slot="{ selected }">
          <button class="tab-button" :class="{ selected: selected }">
            <IconChart />
            Ergebnis
          </button>
        </Tab>
        <Tab as="template" v-slot="{ selected }">
          <button class="tab-button" :class="{ selected: selected }">
            <IconScale />
            Vergleich
          </button>
        </Tab>
        <Tab as="template" v-slot="{ selected }">
          <button class="tab-button" :class="{ selected: selected }">
            <IconComment />
            Begründungen
          </button>
        </Tab>
      </TabList>
      <TabPanels class="p-4 bg-white">
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
  @apply flex flex-col items-center flex-1 w-full py-1 rounded text-white;
  @apply focus:ring focus:ring-blue-900 outline-none motion-safe:transition motion-safe:duration-200;
}

.tab-button.selected {
  @apply bg-white text-blue-800;
}
</style>
