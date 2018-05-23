import { matchPatterns } from "../src/regexp-string-matcher";
import * as assert from "assert";

it("example", () => {
    const inputText = `
GitHub is a web-based hosting service for version control using git.
It is mostly used for computer code.
GitHub launched in 2018-04-10.`;
    // RegExp like strings
    const inputPatterns = [
        "git", // => /git/g
        "/github/i", // => /github/ig
        "/\\d{4}-\\d{2}-\\d{2}/" // => /\d{4}-\d{2}-\d{2}/g
    ];

    const results = matchPatterns(inputText, inputPatterns);
    assert.deepStrictEqual(results, [
        { match: "GitHub", startIndex: 1, endIndex: 7 },
        { match: "git", startIndex: 65, endIndex: 68 },
        { match: "GitHub", startIndex: 107, endIndex: 113 },
        { match: "2018-04-10", startIndex: 126, endIndex: 136 }
    ]);
});

it("example", () => {
    const inputText = `This is a pen.`;
    // RegExp like strings
    const inputPatterns = ["a \\w+"];

    const results = matchPatterns(inputText, inputPatterns);
    console.log(results);
    assert.deepStrictEqual(results, [{ match: "a pen", startIndex: 8, endIndex: 13 }]);
});
