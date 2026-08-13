<script setup lang="ts">
import IconForward from '~icons/material-symbols/arrow-forward'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import IconChevron from '~icons/material-symbols/keyboard-arrow-down-rounded'

const emit = defineEmits(['done'])
</script>

<template>
  <div class="bg-white p-4 md:p-8">
    <h2 class="text-lg!">Wie funktioniert der Real-O-Mat?</h2>
    <p>
      Im Landtag bzw. Abgeordnetenhaus haben die Fraktionen für oder gegen
      Anträge und Gesetzentwürfe gestimmt oder sich enthalten. Der Real-O-Mat
      gleicht ihr Stimmverhalten mit Deiner Position zu 14 Thesen ab.
    </p>

    <h2 class="mt-4 text-lg!">Wie werden die Positionen bewertet?</h2>
    <p>
      Eine Zustimmung entspricht der Option „Ja, finde ich auch“. Eine Ablehnung
      und Enthaltung wird je nach Begründung der Fraktion in
      Beschlussempfehlungen und Plenardebatten als „Nein, das geht mir zu weit“
      bzw. „Nein, das reicht mir nicht aus“ gewertet.
    </p>
    <div class="mt-4">
      <Disclosure v-slot="{ open }">
        <DisclosureButton
          class="flex items-center justify-between rounded bg-purple-100 px-4 py-2 outline-none focus:ring-3 focus:ring-purple-600/50 motion-safe:transition"
        >
          <IconChevron
            aria-hidden="true"
            class="h-5 w-5 -rotate-90 text-purple-900 motion-safe:transition-transform"
            :class="{
              'rotate-0': open,
            }"
          />

          <h3>Beispiel anzeigen</h3>
        </DisclosureButton>
        <DisclosurePanel
          class="mt-2 rounded bg-purple-50 p-4 text-sm text-gray-800"
        >
          <p>
            „Die Landesregierung soll sich auf Bundesebene für eine Überprüfung
            des Waffenrechts einsetzen, jedoch nicht direkt für eine
            Verschärfung.“
          </p>

          <div class="mt-2 space-y-2">
            <p>
              <strong>Ja, finde ich auch</strong>: Die Fraktion hat dem Antrag
              zugestimmt
            </p>
            <p>
              <strong>Nein, geht mir zu weit</strong>: Die Fraktion hat den
              Antrag abgelehnt oder sich enthalten und begründet dies damit,
              dass selbst eine Überprüfung des Waffenrechts derzeit nicht
              notwendig ist.
            </p>
            <p>
              <strong>Nein, reicht mir nicht aus</strong>: Die Fraktion hat den
              Antrag abgelehnt oder sich enthalten und begründet dies damit,
              dass eine reine Überprüfung des Waffenrechts nicht weit genug
              geht. Es sollte verschärft werden.
            </p>
            <p>
              Die genaue Begründung des Abstimmungsverhaltens jeder Fraktion
              kannst du im Detail in der Auswertung nachlesen. Mehr Infos
              findest du in der Methodik zum Real-O-Mat.
            </p>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </div>

    <button class="btn mt-4" @click="$emit('done')">
      <IconForward aria-hidden="true" class="me-1" />
      Weiter
    </button>
  </div>
</template>
