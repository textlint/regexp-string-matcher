import { matchPatterns } from "../src/pattern-string-matcher";
import * as assert from "assert";

it("example", () => {
    const inputText = `
GitHub is a web-based hosting service for version control using git.
It is mostly used for computer code.
GitHub launched in Apr 10, 2008.
`;
    const inputPatterns = [
        "git", // => /git/g
        "/github/i", // /github/ig
        "/\\d+/" // => /\d/g
    ];

    const results = matchPatterns(inputText, inputPatterns);
    assert.deepStrictEqual(results, [
        { match: "GitHub", startIndex: 1, endIndex: 7 },
        { match: "git", startIndex: 65, endIndex: 68 },
        { match: "GitHub", startIndex: 107, endIndex: 113 },
        { match: "10", startIndex: 130, endIndex: 132 },
        { match: "2008", startIndex: 134, endIndex: 138 }
    ]);
});
