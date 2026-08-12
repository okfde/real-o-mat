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
  <div v-if="furtherInfo"
    class="w-full md:w-1/2 md:-rotate-2 md:-mt-6 flex flex-col justify-between align-right bg-yellow-200 mt-6 p-4 md:p-8 md:mr-16 ml-auto shadow-lg">
    <span class="text-xl font-semibold mb-3">Mehr von FragDenStaat</span>
    <p class="info mb-5" v-html="furtherInfo" />
    <div class="flex flex-row justify-end text-right items-center">
      <a href="http://fragdenstaat.de/newsletter?pk_campaign=realomat" target="_blank">
        Jetzt den
        <img :src="FdsLogo.src" alt="Ein Projekt von FragDenStaat" class="ms-1 -mt-3 inline-block w-32" />
        Newsletter abonnieren!
      </a>
      <IconForward aria-hidden="true" class="ms-1 shrink-0 max-md:ms-4" />
    </div>
  </div>
</template>

<style scoped>
@reference "../assets/style.css";

.info:deep(a) {
  @apply text-purple-600 underline hover:text-purple-700 font-semibold;
}
</style>
