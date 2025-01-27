<script setup lang="ts">
import { ref } from 'vue'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/vue'
import IconShare from '~icons/material-symbols/ios-share-rounded'
import IconClose from '~icons/material-symbols/close-rounded'

const isOpen = ref(false)

const closeModal = () => {
  isOpen.value = false
}
const openModal = () => {
  isOpen.value = true
}

const shareText =
  'Mach den Real-O-Mat und finde heraus, welche Partei wie abstimmt! https://real-o-mat.de'
</script>

<template>
  <Teleport to="main">
    <div class="sticky inset-x-0 bottom-12 z-20 mt-12 flex justify-center">
      <button class="btn btn-lg" @click="openModal">
        <IconShare aria-hidden="true" class="me-1" />
        Teile den Real-O-Mat!
      </button>
    </div>

    <TransitionRoot appear :show="isOpen" as="template">
      <Dialog as="div" @close="closeModal" class="relative z-10">
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-black/25" />
        </TransitionChild>

        <div class="fixed inset-0 overflow-y-auto">
          <div
            class="flex min-h-full items-center justify-center p-4 text-center"
          >
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel
                class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <div class="flex">
                  <DialogTitle
                    as="h3"
                    class="flex-1 self-center text-lg leading-6 font-medium"
                  >
                    Teile den Real-O-Mat!
                  </DialogTitle>

                  <div class="ms-auto">
                    <button @click="closeModal" class="btn-text">
                      <IconClose aria-label="Schließen" />
                    </button>
                  </div>
                </div>

                <a
                  :href="`https://bsky.app/intent/compose?text=${shareText}`"
                  target="_blank"
                  class="flex items-center"
                >
                  <svg
                    width="600"
                    height="530"
                    viewBox="0 0 600 530"
                    class="me-2 h-auto w-12"
                    aria-hidden="true"
                  >
                    <path
                      d="m135.72 44.03c66.496 49.921 138.02 151.14 164.28 205.46 26.262-54.316 97.782-155.54 164.28-205.46 47.98-36.021 125.72-63.892 125.72 24.795 0 17.712-10.155 148.79-16.111 170.07-20.703 73.984-96.144 92.854-163.25 81.433 117.3 19.964 147.14 86.092 82.697 152.22-122.39 125.59-175.91-31.511-189.63-71.766-2.514-7.3797-3.6904-10.832-3.7077-7.8964-0.0174-2.9357-1.1937 0.51669-3.7077 7.8964-13.714 40.255-67.233 197.36-189.63 71.766-64.444-66.128-34.605-132.26 82.697-152.22-67.108 11.421-142.55-7.4491-163.25-81.433-5.9562-21.282-16.111-152.36-16.111-170.07 0-88.687 77.742-60.816 125.72-24.795z"
                      fill="#1185fe"
                    />
                  </svg>

                  Bluesky
                </a>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </Teleport>
</template>
