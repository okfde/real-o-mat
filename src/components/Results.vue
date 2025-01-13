<script lang="ts" setup>
import { computed } from 'vue'
import type { Party, Question } from '../content.config'
import { answers, partyNames, weightedTopics } from '../store'

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
  }

  return Object.entries(results)
    .map(([party, score]) => ({
      party: partyNames[party as Party],
      score,
      percentage: (score / answerCount.value) * 100,
    }))
    .sort((a, b) => b.score - a.score)
})

const answerCount = computed(() => Object.values(answers.value).length)
</script>

<template>
  <div class="p-4 bg-white">
    <h2 class="text-4xl font-medium">Ihr Real-O-Mat Ergebnis</h2>
    <div class="my-4">
      <dl class="grid items-center mt-2 gap-x-4 gap-y-8">
        <template v-for="{ party, percentage } in partyMatches" :key="party">
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
  </div>
</template>

<style scoped>
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
