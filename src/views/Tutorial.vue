<script setup lang="ts">
import IconForward from '~icons/material-symbols/arrow-forward'
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/vue'
import IconChevron from '~icons/material-symbols/keyboard-arrow-down-rounded'

const emit = defineEmits(['done'])
</script>

<template>
  <div class="bg-white p-4 md:p-8">
    <h2 class="!text-lg">Wie funktioniert der Real-O-Mat?</h2>
    <p>
      Im Landtag bzw. Abgeordnetenhaus haben die Fraktionen für oder gegen Anträge und Gesetzentwürfe gestimmt oder sich
      enthalten. Der Real-O-Mat gleicht ihr Stimmverhalten mit deiner Position zu 14 Thesen ab. 
    </p>

    <h2 class="mt-4 !text-lg">Wie werden die Positionen bewertet?</h2>
    <p>
      Eine Zustimmung entspricht der Option „Ja, finde ich auch“. Eine Ablehnung und Enthaltung wird je nach Begründung
      der Fraktion in Beschlussempfehlungen und Plenardebatten in „Nein, das geht mir zu weit“ bzw. „Nein, das reicht
      mir nicht aus“ geteilt.
    </p>
    <div class="mt-4">
      <Disclosure v-slot="{ open }">
        <DisclosureButton
          class="flex items-center justify-between rounded bg-purple-100 px-4 py-2 outline-none focus:ring-3 focus:ring-purple-600/50 motion-safe:transition">
          <IconChevron aria-hidden="true" class="h-5 w-5 text-purple-900 -rotate-90 motion-safe:transition-transform"
            :class="{
              'rotate-0': open,
            }" />

          <h3>Beispiel anzeigen</h3>
        </DisclosureButton>
        <DisclosurePanel class="mt-2 rounded bg-purple-50 p-4 text-sm text-gray-800">
          <p>
            „Bürgergeldempfänger*innen, die wiederholt eine existenzsichernde Arbeit
            ablehnen, soll für zwei Monate der komplette Regelsatz des Bürgergelds
            gestrichen werden.“
          </p>

          <div class="mt-2 space-y-2">
            <p>
              <strong>Ja, finde ich auch</strong>: Die Fraktion hat dem Antrag
              zugestimmt
            </p>
            <p>
              <strong>Nein, geht mir zu weit</strong>: Die Fraktion hat den Antrag
              abgelehnt oder sich enthalten und begründet dies damit, dass diese
              Sanktionierung von Bürgergeldempfänger*innen zu weitreichend ist.
            </p>
            <p>
              <strong>Nein, reicht mir nicht aus</strong>: Die Fraktion hat den Antrag
              abgelehnt oder sich enthalten und begründet dies damit, dass diese
              Sanktionierung von Bürgergeldempfänger*innen nicht weit genug geht. Es
              sollen stärkere Maßnahmen ergriffen werden.
            </p>
            <p>
              Die genaue Begründung des Abstimmungsverhaltens jeder Fraktion kannst Du im Detail in der Auswertung
              nachlesen.
              Mehr Infos findest Du in der Methodik zum Real-O-Mat. 
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
