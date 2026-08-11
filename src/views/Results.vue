<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@headlessui/vue'
import type { Election } from '../content.config'
import { useStore } from '../store'
import { publicUrl, shareText } from '../const'
import ResultMatches from '../components/ResultMatches.vue'
import ResultComparison from '../components/ResultComparison.vue'
import ResultComments from '../components/ResultComments.vue'
import FurtherInfo from '../components/FurtherInfo.vue'
import IconChart from '~icons/material-symbols/bar-chart-4-bars-rounded'
import IconScale from '~icons/material-symbols/balance-rounded'
import IconComment from '~icons/material-symbols/comment-outline-rounded'
import IconShare from '~icons/material-symbols/ios-share-rounded'
import IconHeart from '~icons/material-symbols/favorite'

const props = defineProps<{
  election: Election
}>()

const { getPartyMatches } = useStore(props.election.slug)

const canShare = ref(false)
const shareData = {
  title: shareText,
  url: publicUrl,
}

const partyMatches = computed(() =>
  getPartyMatches(props.election.questions, props.election.parties),
)

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
      <TabList class="flex space-x-2 rounded-t-lg mb-2">
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
          <ResultComparison :election="election" />
        </TabPanel>
        <TabPanel :unmount="false">
          <ResultComments :election="election" />
        </TabPanel>
      </TabPanels>
    </TabGroup>
    <FurtherInfo :election="election" />
    <Teleport to="main" v-if="canShare">
      <div class="inset-x-0 bottom-12 z-20 mt-12 flex max-md:flex-col max-md:items-center gap-4 justify-center">
        <button class="btn btn-lg inline shadow-md" @click="share">
          <IconShare aria-hidden="true" class="me-1" />
          Teile den Real-O-Mat!
        </button>
        <a class="btn btn-lg inline shadow-md" href="//fragdenstaat.de/jetzt-spenden/?pk_campaign=realomat"
          target="_blank">
          <IconHeart aria-hidden="true" class="me-1" />
          Jetzt spenden!
        </a>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
@reference "../assets/style.css";

.tab-button {
  @apply flex w-full flex-1 flex-col items-center justify-center py-3 md:flex-row;
  @apply rounded inset-ring-2 inset-ring-transparent bg-transparent text-xs text-purple-800 md:text-xl;
  @apply duration-200 outline-none focus:inset-ring-4 focus:inset-ring-purple-900 motion-safe:transition;
}

.tab-button:deep(svg) {
  @apply max-md:h-8 max-md:w-8 md:me-1;
}

.tab-button.selected {
  @apply bg-white text-purple-800;
}

.tab-button:not(.selected) {
  @apply inset-ring-purple-800;
}
</style>
