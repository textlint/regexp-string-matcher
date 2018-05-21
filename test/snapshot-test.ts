import * as fs from "fs";
import * as assert from "assert";
import * as path from "path";
import { matchPatterns } from "../src/regexp-string-matcher";

const fixturesDir = path.join(__dirname, "snapshots");
/**
 * # How ta add test?
 *
 * 1. Create new dir to ./snapshots/<name>/
 * 2. Add `input.txt` and `input-patterns.json`
 * 3. Run `npm run test:updateSnapshot`
 * 4. You should verify the output results manually
 * 5. Commit it
 *
 */
describe("Snapshot testing", () => {
    fs.readdirSync(fixturesDir).map(caseName => {
        it(`Test ${caseName}`, async function() {
            const fixtureDir = path.join(fixturesDir, caseName);
            const inputText: string = fs.readFileSync(path.join(fixtureDir, "input.txt"), "utf-8");
            const inputPatterns: string[] = require(path.join(fixtureDir, "input-patterns.json"));
            const results = matchPatterns(inputText, inputPatterns);
            const outputForHumanPath = path.join(fixtureDir, "output-for-human.md");
            const outputForMachinePath = path.join(fixtureDir, "output-for-machine.json");

            const humanResult = results
                .map(result => {
                    return `
- match text: **${result.match}**
- startIndex: **${result.startIndex}**
- endIndex: **${result.endIndex}**

\`\`\`
${inputText.slice(0, result.startIndex)}**${inputText.slice(result.startIndex, result.endIndex)}**${inputText.slice(
                        result.endIndex
                    )}
\`\`\`

`;
                })
                .join("\n");
            // UPDATE_SNAPSHOT=1 npm test
            if (process.env.UPDATE_SNAPSHOT) {
                fs.writeFileSync(outputForHumanPath, humanResult, "utf-8");
                fs.writeFileSync(outputForMachinePath, JSON.stringify(results, null, 4), "utf-8");
                this.skip();
                return;
            }
            const outputForHuman = fs.readFileSync(outputForHumanPath, "utf-8");
            const outputForMachine = JSON.parse(fs.readFileSync(outputForMachinePath, "utf-8"));
            assert.strictEqual(
                humanResult,
                outputForHuman,
                `
${fixtureDir}
`
            );
            assert.deepStrictEqual(
                results,
                outputForMachine,
                `
${fixtureDir}
`
            );
        });
    });
});
