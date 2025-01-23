<script setup lang="ts">
import { useStore, Stage } from '../store'

const { currentStage } = useStore()
</script>

<template>
  <div class="background" :class="{ linear: currentStage !== Stage.Intro }">
    <slot />
  </div>
</template>

<style>
.background {
  @apply relative;
  background: conic-gradient(
    from 180deg at 50% 50%,
    theme(colors.primary.purple) 0deg,
    theme(colors.primary.yellow) 95deg,
    theme(colors.primary.cyan) 267deg,
    theme(colors.primary.purple) 360deg
  );
}

.background > * {
  z-index: 10;
}

.background::after {
  content: '';
  @apply transition-opacity opacity-0 absolute inset-0;
  background: linear-gradient(
    to bottom,
    theme(colors.primary.cyan),
    theme(colors.primary.purple)
  );
}

.background.linear::after {
  @apply opacity-100 duration-500;
}
</style>
