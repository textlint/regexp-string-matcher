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
        "/(\\d{4})-(\\d{2})-(\\d{2})/" // => /\d{4}-\d{2}-\d{2}/g
    ];

    const results = matchPatterns(inputText, inputPatterns);
    assert.deepStrictEqual(results, [
        { match: "GitHub", startIndex: 1, endIndex: 7, captures: [] },
        { match: "git", startIndex: 65, endIndex: 68, captures: [] },
        { match: "GitHub", startIndex: 107, endIndex: 113, captures: [] },
        { match: "2018-04-10", startIndex: 126, endIndex: 136, captures: ["2018", "04", "10"] }
    ]);
});

it("RegExp-like string", () => {
    const inputText = `This is a pen.`;
    // RegExp like strings
    const inputPatterns = ["/a (\\w+)/"];

    const results = matchPatterns(inputText, inputPatterns);
    assert.deepStrictEqual(results, [{ match: "a pen", startIndex: 8, endIndex: 13, captures: ["pen"] }]);
});
