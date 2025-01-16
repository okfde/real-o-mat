import { sheets, auth, type sheets_v4 } from '@googleapis/sheets'
import memoizeFs from 'memoize-fs'

export async function importGoogleSheet(
  keyFilename: string,
  spreadsheetId: string,
  range: string,
) {
  const authClient = new auth.GoogleAuth({
    keyFilename,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  })

  const service = await sheets({
    version: 'v4',
    auth: authClient,
  })

  const values = await service.spreadsheets.get({
    spreadsheetId,
    ranges: [range],
    includeGridData: true,
  })

  if (values.data.sheets?.[0] === undefined) {
    throw new Error('No values found in Google Sheet')
  }

  const data = values.data.sheets[0].data?.[0]
    .rowData!.map((row) => {
      return row.values!.map((cell) => linkifyCell(cell))
    })
    .slice(2)

  let lastCategory = ''

  return data!
    .filter(([_, thesis]) => thesis) // filter out empty rows
    .map(
      (
        [
          category,
          thesis,
          proposalDescription,
          proposalDocument,
          spd,
          spdComment,
          cdu,
          cduComment,
          fdp,
          fdpComment,
          gruene,
          grueneComment,
          bsw,
          bswComment,
          linke,
          linkeComment,
          afd,
          afdComment,
        ],
        i,
      ) => {
        const item = {
          id: `question-${i}`,
          index: i,
          thesis,
          category: category || lastCategory,
          answers: [
            { party: 'spd', answer: spd, comment: spdComment },
            { party: 'cdu', answer: cdu, comment: cduComment },
            { party: 'fdp', answer: fdp, comment: fdpComment },
            { party: 'gruene', answer: gruene, comment: grueneComment },
            { party: 'bsw', answer: bsw, comment: bswComment },
            { party: 'linke', answer: linke, comment: linkeComment },
            { party: 'afd', answer: afd, comment: afdComment },
          ],
        }

        if (category) {
          lastCategory = category
        }
        return item
      },
    )
}

const memoizer = memoizeFs({ cachePath: '.cache/google-sheet' })

export const cachedImportGoogleSheet = await memoizer.fn(importGoogleSheet, {
  maxAge: 60 * 60 * 1000,
})

function linkifyCell(cell: sheets_v4.Schema$CellData): string {
  let text = cell.formattedValue!
  if (!cell.textFormatRuns) return text

  let offset = 0

  const formatting = cell.textFormatRuns

  cell.textFormatRuns?.forEach((formatObj, index) => {
    const { startIndex, format } = formatObj
    const adjustedIndex = startIndex! + offset

    if (format?.link?.uri) {
      // Find the end index for the link
      const endIndex =
        index + 1 < formatting.length
          ? formatting[index + 1].startIndex!
          : text.length
      let adjustedEndIndex = endIndex + offset

      // Insert the opening anchor tag
      const anchor = `<a href="${format.link.uri}" target="_blank" rel="noopener noreferrer">`
      text = text.slice(0, adjustedIndex) + anchor + text.slice(adjustedIndex)
      offset += anchor.length

      adjustedEndIndex += anchor.length

      const anchorClose = '</a>'

      // Insert the closing anchor tag
      text =
        text.slice(0, adjustedEndIndex) +
        anchorClose +
        text.slice(adjustedEndIndex)
      offset += anchorClose.length
    }
  })

  return text
}
