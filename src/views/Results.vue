<script lang="ts" setup>
import { computed } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import type { Party, Question } from '../content.config'
import { answers, parties, partyNames, weightedTopics } from '../store'
import IconChart from '~icons/material-symbols/bar-chart-4-bars-rounded'
import IconScale from '~icons/material-symbols/balance-rounded'
import IconComment from '~icons/material-symbols/comment-outline-rounded'
import AnswerIndicator from '../components/AnswerIndicator.vue'

const props = defineProps<{
  questions: Question[]
}>()

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

const answerCount = computed(() => Object.values(answers.value).length)
</script>

<template>
  <div class="">
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
          <h2 class="text-4xl font-medium">Ihr Real-O-Mat Ergebnis</h2>
          <div class="my-4">
            <dl class="grid items-center mt-2 gap-x-4 gap-y-8">
              <template
                v-for="{ party, percentage } in partyMatches"
                :key="party"
              >
                <dt class="md:text-xl font-medium text-nowrap">
                  {{ party }}
                </dt>
                <dd class="flex items-center space-x-4">
                  <div class="flex-1">
                    <div class="bg-blue-100 rounded-full overflow-hidden">
                      <div
                        class="h-3 bg-blue-900 progress-result"
                        :style="{
                          width: `${percentage}%`,
                        }"
                      />
                    </div>
                  </div>

                  <span>{{ Math.round(percentage) }}%</span>
                </dd>
              </template>
            </dl>
          </div>
        </TabPanel>
        <TabPanel>
          <h2 class="text-4xl font-medium">Vergleich</h2>
          <p class="mt-4">
            Hier können Sie die Ergebnisse des Real-O-Mat mit den Positionen der
            Parteien vergleichen.
          </p>

          <div class="max-md:overflow-auto">
            <table class="grid grid-cols-12">
              <thead class="contents">
                <tr class="contents">
                  <th class="text-start pe-4 col-span-3">These</th>
                  <th class="text-start pe-4">Ihre Position</th>
                  <th
                    class="text-start pe-4"
                    v-for="party in partyNames"
                    :key="party"
                  >
                    {{ party }}
                  </th>
                </tr>
              </thead>
              <tbody class="contents">
                <tr
                  class="contents"
                  v-for="question in questions"
                  :key="question.id"
                >
                  <td class="py-4 col-span-3">{{ question.thesis }}</td>
                  <td class="py-4">
                    <AnswerIndicator
                      :answer="answers[question.id]?.answer ?? '/'"
                    />
                  </td>
                  <td class="py-4" v-for="party in parties" :key="party">
                    <AnswerIndicator
                      :answer="
                        question.answers.find((a) => a.party === party)!.answer
                      "
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </TabPanel>
        <TabPanel>Content 3</TabPanel>
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

dl {
  grid-template-columns: min-content auto;
}

.progress-result {
  animation: result-bar 1s cubic-bezier(0, 0, 0.2, 1);
  transform-origin: left;
}

@keyframes result-bar {
  from {
    transform: scaleX(0);
  }

  to {
    transform: scaleX(1);
  }
}
</style>
