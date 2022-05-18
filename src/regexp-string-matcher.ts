import uniq from "lodash.uniq";
import uniqWith from "lodash.uniqwith";
import sortBy from "lodash.sortby";
import escapeStringRegexp from "escape-string-regexp";
import { isRegExpString, parseRegExpString } from "./regexp-parse";

const DEFAULT_FLAGS = "ug";

const defaultFlags = (flagsString: string) => {
    if (flagsString.length === 0) {
        return DEFAULT_FLAGS;
    }
    return uniq((flagsString + DEFAULT_FLAGS).split("")).join("");
};

export interface matchPatternResult {
    match: string;
    // captured results
    // [$1, $2 ...]
    captures: string[];
    startIndex: number;
    endIndex: number;
}

export const createRegExp = (patternString: string, defaultFlag: string = DEFAULT_FLAGS): RegExp => {
    if (patternString.length === 0) {
        throw new Error("Empty string can not handled");
    }
    if (isRegExpString(patternString)) {
        const regExpStructure = parseRegExpString(patternString);
        if (regExpStructure) {
            return new RegExp(regExpStructure.source, defaultFlags(regExpStructure.flagString));
        }
        throw new Error(`"${patternString}" can not parse as RegExp.`);
    } else {
        return new RegExp(escapeStringRegexp(patternString), defaultFlag);
    }
};

const isEqualMatchPatternResult = (a: matchPatternResult, b: matchPatternResult): boolean => {
    return a.startIndex === b.startIndex && a.endIndex === b.endIndex && a.match === b.match;
};
/**
 * Match regExpLikeStrings and return matchPatternResults
 * @param text target text
 * @param regExpLikeStrings an array of pattern string
 */
export const matchPatterns = (text: string, regExpLikeStrings: string[]): matchPatternResult[] => {
    const matchPatternResults: matchPatternResult[] = [];
    regExpLikeStrings
        .map((patternString) => {
            return createRegExp(patternString);
        })
        .forEach((regExp) => {
            const results = text.matchAll(regExp);
            Array.from(results).forEach((result) => {
                if (result.index === undefined) {
                    return;
                }
                const match = result[0];
                const index = result.index;
                matchPatternResults.push({
                    match: match,
                    captures: result.slice(1), // without match all text - [$1, $2 ...]
                    startIndex: index,
                    endIndex: index + match.length
                });
            });
        });
    const uniqResults = uniqWith(matchPatternResults, isEqualMatchPatternResult);
    return sortBy(uniqResults, ["startIndex", "endIndex"]);
};
