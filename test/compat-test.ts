import * as assert from "assert";
import { createRegExp, matchPatternResult, matchPatterns } from "../src/regexp-string-matcher";

/**
 * matchPatterns of @textlint/regexp-string-matcher 2.0.3.
 * It is the reference to check that the current implementation returns the same results.
 */
const matchPatterns_2_0_3 = (text: string, regExpLikeStrings: string[]): matchPatternResult[] => {
    const matchPatternResults: matchPatternResult[] = [];
    regExpLikeStrings
        .map((patternString) => createRegExp(patternString))
        .forEach((regExp) => {
            Array.from(text.matchAll(regExp)).forEach((result) => {
                if (result.index === undefined) {
                    return;
                }
                const match = result[0];
                const index = result.index;
                matchPatternResults.push({
                    match: match,
                    captures: result.slice(1),
                    startIndex: index,
                    endIndex: index + match.length
                });
            });
        });
    const uniqResults = matchPatternResults.filter((result, index) => {
        return (
            matchPatternResults.findIndex(
                (other) =>
                    result.startIndex === other.startIndex &&
                    result.endIndex === other.endIndex &&
                    result.match === other.match
            ) === index
        );
    });
    return uniqResults.sort((a, b) => {
        if (a.startIndex !== b.startIndex) {
            return a.startIndex - b.startIndex;
        }
        return a.endIndex - b.endIndex;
    });
};

describe("compatibility with 2.0.3", () => {
    const text = `This is a pen. Yahoo! jQuery?? 日本語の文章です！ foo1Bar FOO2 bar3baz
aaa abc ABC 123 456 e-mail https://example.com/a?b=c 🍣🍺 x.y.z`;
    const patternSets: string[][] = [
        ["pen"],
        ["Yahoo!", "jQuery"],
        ["/[A-Z]+/", "/[a-z]+/", "/\\w+/"],
        ["/a/", "a", "/a+/", "aa"],
        ["/(?=a)/", "/\\b/"],
        ["/(\\d)(\\d)(\\d)/", "/\\d+/"],
        ["/\\p{Script=Han}+/u", "/[！？]/"],
        ["/foo(\\d)/i", "/bar(?<n>\\d)/i"],
        ["/./s", "/\\S+/"],
        ["e-mail", "x.y.z", "?b=c", "(a)"],
        ["/🍣|🍺/", "🍣"],
        ["not-found", "/not-found/"]
    ];
    patternSets.forEach((patterns) => {
        it(`should return the same results for ${JSON.stringify(patterns)}`, () => {
            // call twice: the second call uses cached RegExp
            const expected = matchPatterns_2_0_3(text, patterns);
            assert.deepStrictEqual(matchPatterns(text, patterns), expected);
            assert.deepStrictEqual(matchPatterns(text, patterns), expected);
        });
    });
    it("should return the same results for empty text", () => {
        assert.deepStrictEqual(matchPatterns("", ["/(?:)/", "a"]), matchPatterns_2_0_3("", ["/(?:)/", "a"]));
    });
    it("should return the same results for each text with the same patterns", () => {
        const patterns = ["/[A-Z]\\w+/", "is", "/\\d+/"];
        text.split(/\s+/).forEach((word) => {
            assert.deepStrictEqual(matchPatterns(word, patterns), matchPatterns_2_0_3(word, patterns));
        });
    });
    it("should throw an error for an empty pattern every time", () => {
        assert.throws(() => matchPatterns("text", ["text", ""]));
        assert.throws(() => matchPatterns("text", ["text", ""]));
    });
    it("should throw an error for an invalid RegExp every time", () => {
        assert.throws(() => matchPatterns("text", ["/(/"]));
        assert.throws(() => matchPatterns("text", ["/(/"]));
    });
    it("should return a new RegExp from createRegExp", () => {
        assert.notStrictEqual(createRegExp("/a/"), createRegExp("/a/"));
    });
});
