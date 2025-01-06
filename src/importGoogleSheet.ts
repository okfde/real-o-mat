import { sheets, auth } from '@googleapis/sheets'
import memoizeFs from 'memoize-fs'

console.log(process.cwd() + '/service-account.json')

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

  const values = await service.spreadsheets.values.get({
    spreadsheetId,
    range,
  })

  if (!values.data.values) {
    throw new Error('No values found in Google Sheet')
  }

  const data = values.data.values.slice(2)

  let lastCategory = ''

  return data
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
        const data = {
          id: `question-${i}`,
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
        return data
      },
    )
}

const memoizer = memoizeFs({ cachePath: '.cache/google-sheet' })

export const cachedImportGoogleSheet = await memoizer.fn(importGoogleSheet, {
  maxAge: 60 * 60 * 1000,
})
