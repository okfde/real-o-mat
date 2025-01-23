<script setup lang="ts">
import { useStore, Stage } from '../store'

const { currentStage } = useStore()
</script>

<template>
  <div class="conic"></div>
  <div class="linear" :class="{ visible: currentStage >= Stage.Weights }"></div>
</template>

<style>
.conic {
  @apply fixed inset-0 -z-10;
  background: conic-gradient(
    from 180deg at 50% 50%,
    theme(colors.primary.purple) 0deg,
    theme(colors.primary.yellow) 95deg,
    theme(colors.primary.cyan) 267deg,
    theme(colors.primary.purple) 360deg
  );
}

.linear {
  @apply fixed inset-0 -z-10;
  @apply transition-opacity opacity-0;
  background: linear-gradient(
    to bottom,
    theme(colors.primary.cyan),
    theme(colors.primary.purple)
  );
}

.linear.visible {
  @apply opacity-100 duration-500;
}
</style>
