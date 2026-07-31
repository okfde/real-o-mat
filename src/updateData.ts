// Load data from nocoDB and convert into YAML format
// import { getSecret } from "astro:env/server";

import "dotenv/config";
import fs from "fs/promises";
import * as yaml from "js-yaml";
import util from "util";
const NOCODB_URL = process.env.NOCODB_URL!;

const elections_url = process.env.NOCODB_ELECTIONS_URL!;
const questions_url = process.env.NOCODB_QUESTIONS_URL!;
const answers_url = process.env.NOCODB_ANSWERS_URL!;
const parties_url = process.env.NOCODB_PARTIES_URL!;

const NOCODB_TOKEN = process.env.NOCODB_TOKEN!;

async function fetchTable(url: string) {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'xc-token': NOCODB_TOKEN
    }
  });
  return (await res.json()).records as any[];
}

// Final yaml format:

// title: Bundestagswahl 2026
// slug: btw25
// date: 2025-02-15
// archived: false
// questions:
//   - id: question-0
//     index: 0
//     thesis: 'BTW Bürgergeldempfänger*innen, die wiederholt eine existenzsichernde Arbeit ablehnen, soll für zwei Monate der komplette Regelsatz des Bürgergelds gestrichen werden. '
//     category: Arbeit
//     answers:
//       - party: spd
//         answer: richtig
//         comment: 'Die SPD-Fraktion stimmt dem <a href="https://dserver.bundestag.de/btd/20/099/2009999.pdf"

  const elections = await fetchTable(elections_url);
  const questions = await fetchTable(questions_url);
  const answers = await fetchTable(answers_url);
  const parties = await fetchTable(parties_url);

  const partySlug = (party: any) =>
    party.fields.Title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // delete all yaml files in data/elections
  const electionFiles = await fs.readdir('./src/data/elections');
  for (const file of electionFiles) {
    if (file.endsWith('.yaml')) {
      await fs.unlink(`./src/data/elections/${file}`);
    }
  }

  for (const election of elections) {

    if (!election.fields.Veröffentlicht) continue;

    const electionQuestions = questions.filter((q) => q.fields.Wahl.id === election.id).map((question, index) => {
      return {
        id: `question-${index}`,
        index,
        category: question.fields.Kategorie,
        thesis: question.fields.Title,
        answers: answers.filter((a) => a.fields.These.id === question.id).map((answer) => {
          return {
            party: partySlug(parties.find((p) => p.id === answer.fields.Partei.id)),
            answer: answer.fields.Position,
            comment: answer.fields.Kommentar,
          };
        })
      };
    });

    // collect party slugs that actually appear in this election's answers
    const partySlugs = new Set(electionQuestions.flatMap(q => q.answers.map(a => a.party)));

    const electionParties = parties
      .filter((party) => partySlugs.has(partySlug(party)))
      .map((party) => {
        return {
          name: party.fields.Title,
          slug: partySlug(party),
          color: party.fields.Farbe,
        };
      });

    const electionData = {
      title: election.fields.Title,
      slug: election.fields.Slug,
      date: election.fields.Datum,
      archived: election.fields.Archiviert,
      questions: electionQuestions,
      parties: electionParties,
    };
    console.log("electionData");

    console.log(util.inspect(electionData, {showHidden: false, depth: null, colors: true}))

    await fs.writeFile(`./src/data/elections/${electionData.slug}.yaml`, yaml.dump(electionData), 'utf8')
      .then(() => console.log(`YAML file for ${electionData.slug} created successfully.`))
      .catch(err => console.error(`Error writing YAML file for ${electionData.slug}:`, err));
  }
