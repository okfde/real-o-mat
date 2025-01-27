<script setup lang="ts">
import type { Question } from '../content.config'
import QuestionCard from '../components/QuestionCard.vue'
import IconForward from '~icons/material-symbols/arrow-forward'

const emit = defineEmits(['done'])

const exampleQuestion: Question = {
  id: 'example',
  index: 1,
  thesis:
    'Bürgergeldempfänger*innen, die wiederholt eine existenzsichernde Arbeit ablehnen, soll für zwei Monate der komplette Regelsatz des Bürgergelds gestrichen werden.',
  category: 'Arbeit',
  answers: [
    { party: 'spd', answer: 'nicht weit genug' },
    { party: 'linke', answer: 'zu weit' },
    { party: 'gruene', answer: 'richtig' },
  ],
}
</script>

<template>
  <div class="bg-white p-8 md:p-16">
    <h2 class="text-lg">Wie funktioniert der Real-O-Mat?</h2>
    <p>
      Der Real-O-Mat hat das Abstimmungsverhalten der Parteien zu 20 Thesen
      ausgewertet. Die Parteien haben für oder gegen Anträge und
      Gesetzesentwürfe gestimmt oder sich enthalten.
    </p>

    <h2 class="text-lg">Wie werden die Positionen bewertet?</h2>
    <p>
      Eine Zustimmung entspricht der Option „ja, finde ich auch“. Eine Ablehnung
      und Enthaltung wird nach Begründung der Fraktion in Beschlussempfehlungen
      und Plenardebatten in „nein, das geht mir zu weit“ bzw. „nein, das reicht
      mir nicht aus“ geteilt.
    </p>

    <h2 class="mt-8 text-lg">Beispiel</h2>
    <QuestionCard
      :currentQuestionIndex="1"
      :currentQuestionProgress="1"
      :questionsCount="20"
      :currentQuestion="exampleQuestion"
      :compact="true"
      class="border-2 border-primary-purple shadow-lg"
    />

    <div class="mt-8 space-y-2">
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
        Sanktionierung von Bürgergeldempfänger*innen zu weit geht. Es sollen
        stärkere Maßnahmen ergriffen werden.
      </p>
      <p>
        Die genaue Begründung des Abstimmungsverhaltens jeder Fraktion können
        Sie in der Auswertung nachlesen.
      </p>
    </div>

    <button class="btn mt-4" @click="$emit('done')">
      <IconForward aria-hidden="true" class="me-1" />
      Weiter
    </button>
  </div>
</template>
