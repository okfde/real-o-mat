import {
  shareResultTitle,
  shareResultBody,
  shareResultEmojiFilled,
  shareResultEmojiEmpty,
} from './const.ts'
import type { Party, Question } from './content.config'

const barCells = 8

export function getShareResultText(
  partyMatches: { party: string; percentage: number }[],
  electionName: string,
) {
  const lines = partyMatches.map(({ party, percentage }) => {
    const filled = Math.round((percentage / 100) * barCells)
    const bar =
      shareResultEmojiFilled.repeat(filled) +
      shareResultEmojiEmpty.repeat(barCells - filled)
    return `${bar} ${percentage}% ${party}`
  })

  function interpolateElectionName(template: string, electionName: string) {
    return template.replace(
      '{electionName}',
      electionName ? `${electionName}` : 'kommenden Wahl',
    )
  }

  const interpolatedResultTitle = interpolateElectionName(
    shareResultTitle,
    electionName,
  )
  const interpolatedResultBody = interpolateElectionName(
    shareResultBody,
    electionName,
  )

  return `${interpolatedResultTitle}\n\n${lines.join('\n')}\n\n${interpolatedResultBody}`
}

export function changeLinksToExternal(html: string) {
  return html.replace(
    /<a\s+href=/g,
    '<a target="_blank" rel="noopener noreferrer" href=',
  )
}

export function getPartyAnswer(question: Question, party: Party) {
  return question.answers.find((a) => a.party === party.slug)?.answer
}
