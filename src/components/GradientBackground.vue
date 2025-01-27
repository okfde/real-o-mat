<script setup lang="ts">
import { computed, getCurrentInstance, onMounted } from 'vue'
import { useStore, Stage } from '../store'

const { currentStage } = useStore()

const visible = computed(() => currentStage.value >= Stage.Weights)

onMounted(() => {
  const instance = getCurrentInstance()
  instance?.update()
})
</script>

<template>
  <div class="conic"></div>
  <div class="linear" :class="{ visible }"></div>
</template>

<style scoped>
@reference "../assets/style.css";

.conic {
  @apply fixed inset-0 -z-10;
  background: conic-gradient(
    from 180deg at 50% 50%,
    var(--color-primary-purple) 0deg,
    var(--color-primary-yellow) 95deg,
    var(--color-primary-cyan) 267deg,
    var(--color-primary-purple) 360deg
  );
}

.linear {
  @apply fixed inset-0 -z-10;
  @apply opacity-0 transition-opacity;
  background: linear-gradient(
    to bottom,
    var(--color-primary-cyan),
    var(--color-primary-purple)
  );
}

.linear.visible {
  @apply opacity-100 duration-500;
}
</style>
