<script setup lang="ts">
import { computed } from 'vue'
import type { Election } from '../content.config'
import { useStore } from '../store'

import FdsLogo from '../assets/fragdenstaat.svg'
import IconForward from '~icons/material-symbols/arrow-forward'

const props = defineProps<{
  election: Election
}>()

const { getFurtherInfo } = useStore(props.election.slug)

const furtherInfo = computed(() => getFurtherInfo(props.election.questions))
</script>

<template>
  <div
    v-if="furtherInfo"
    class="align-right mt-6 ml-auto flex w-full flex-col justify-between bg-yellow-200 p-4 shadow-lg md:-mt-6 md:mr-16 md:w-1/2 md:-rotate-2 md:p-8 md:will-change-transform"
  >
    <span class="mb-3 text-xl font-semibold">Mehr von FragDenStaat</span>
    <p class="info mb-5" v-html="furtherInfo" />
    <div class="flex flex-row items-center justify-end text-right">
      <a
        href="http://fragdenstaat.de/newsletter?pk_campaign=realomat"
        target="_blank"
      >
        Jetzt den
        <img
          :src="FdsLogo.src"
          alt="FragDenStaat"
          class="ms-1 -mt-3 inline-block w-32"
        />
        Newsletter abonnieren!
      </a>
      <IconForward aria-hidden="true" class="ms-1 shrink-0 max-md:ms-4" />
    </div>
  </div>
</template>

<style scoped>
@reference "../assets/style.css";

.info:deep(a) {
  @apply font-semibold text-purple-600 underline hover:text-purple-700;
}
</style>
