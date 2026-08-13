import {
  shareResultTitle,
  shareResultBody,
  shareResultEmojiFilled,
  shareResultEmojiEmpty,
} from './const.ts'

const barCells = 8

export function getShareResultText(
  partyMatches: { party: string; percentage: number }[],
) {
  const lines = partyMatches.map(({ party, percentage }) => {
    const filled = Math.round((percentage / 100) * barCells)
    const bar =
      shareResultEmojiFilled.repeat(filled) +
      shareResultEmojiEmpty.repeat(barCells - filled)
    return `${bar} ${percentage}% ${party}`
  })
  return `${shareResultTitle}\n\n${lines.join('\n')}\n\n${shareResultBody}`
}

export function changeLinksToExternal(html: string) {
   return html.replace(/<a\s+href=/g, '<a target="_blank" rel="noopener noreferrer" href=')
}
