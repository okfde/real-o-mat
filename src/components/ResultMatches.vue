<script setup lang="ts">
defineProps<{
  partyMatches: { party: string; score: number; percentage: number }[]
}>()
</script>

<template>
  <div class="p-4 md:p-8 backdrop-blur bg-white/75">
    <h2>Ihr Real-O-Mat Ergebnis</h2>
    <div class="mt-6">
      <dl class="grid items-center mt-2 gap-x-4 gap-y-8">
        <template v-for="{ party, percentage } in partyMatches" :key="party">
          <dt class="md:text-xl font-medium whitespace-nowrap">
            {{ party }}
          </dt>
          <dd class="flex items-center space-x-4">
            <div class="flex-1">
              <div class="bg-white rounded-full overflow-hidden">
                <div
                  class="h-3 bg-purple-900 progress-result"
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
