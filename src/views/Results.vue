<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import type { Question } from '../content.config'
import { partyNames, useStore } from '../store'
import { publicUrl, shareText } from '../const'
import ResultMatches from '../components/ResultMatches.vue'
import ResultComparison from '../components/ResultComparison.vue'
import ResultComments from '../components/ResultComments.vue'
import IconChart from '~icons/material-symbols/bar-chart-4-bars-rounded'
import IconScale from '~icons/material-symbols/balance-rounded'
import IconComment from '~icons/material-symbols/comment-outline-rounded'
import IconShare from '~icons/material-symbols/ios-share-rounded'

const props = defineProps<{
  questions: Question[]
}>()

const { getPartyMatches } = useStore()

const canShare = ref(false)
const shareData = {
  title: shareText,
  url: publicUrl,
}

const partyMatches = computed(() => getPartyMatches(props.questions))

onMounted(() => {
  canShare.value = navigator.canShare?.(shareData)
})

const share = () => {
  navigator.share(shareData)
}
</script>

<template>
  <div>
    <TabGroup>
      <TabList class="flex space-x-1 rounded-t-lg bg-primary-purple/30 p-1">
        <Tab as="template" v-slot="{ selected }">
          <button class="tab-button" :class="{ selected: selected }">
            <IconChart aria-hidden="true" />
            Ergebnis
          </button>
        </Tab>
        <Tab as="template" v-slot="{ selected }">
          <button class="tab-button" :class="{ selected: selected }">
            <IconScale aria-hidden="true" />
            Parteienvergleich
          </button>
        </Tab>
        <Tab as="template" v-slot="{ selected }">
          <button class="tab-button" :class="{ selected: selected }">
            <IconComment aria-hidden="true" />
            Begründungen
          </button>
        </Tab>
      </TabList>
      <TabPanels>
        <TabPanel :unmount="false">
          <ResultMatches :partyMatches="partyMatches" />
        </TabPanel>
        <TabPanel :unmount="false">
          <ResultComparison :questions="questions" />
        </TabPanel>
        <TabPanel :unmount="false"
          ><ResultComments :questions="questions"
        /></TabPanel>
      </TabPanels>
    </TabGroup>

    <Teleport to="main" v-if="canShare">
      <div class="sticky inset-x-0 bottom-12 z-20 mt-12 flex justify-center">
        <button class="btn btn-lg" @click="share">
          <IconShare aria-hidden="true" class="me-1" />
          Teile den Real-O-Mat!
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
@reference "../assets/style.css";

.tab-button {
  @apply flex w-full flex-1 flex-col items-center justify-center py-2 md:flex-row;
  @apply rounded border-2 border-transparent bg-transparent text-xs text-white md:text-xl;
  @apply duration-200 outline-none focus:ring-3 focus:ring-purple-900 motion-safe:transition;
}

.tab-button:deep(svg) {
  @apply max-md:h-8 max-md:w-8 md:me-1;
}

.tab-button.selected {
  @apply bg-white text-purple-800;
}

.tab-button:not(.selected) {
  @apply border-white;
}
</style>
