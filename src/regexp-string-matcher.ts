import { isRegExpString, parseRegExpString } from "./regexp-parse";

const DEFAULT_FLAGS = "ug";

/**
 * Escape RegExp special characters.
 * Same as escape-string-regexp@4
 * https://github.com/sindresorhus/escape-string-regexp/blob/v4.0.0/index.js
 * TODO: Replace with RegExp.escape when supported Node.js versions are >= 24
 */
const escapeStringRegexp = (string: string): string => {
    // Use a simple backslash escape when it's always valid,
    // and a \xnn escape when the simpler form would be disallowed by Unicode patterns' stricter grammar.
    return string.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&").replace(/-/g, "\\x2d");
};

const defaultFlags = (flagsString: string) => {
    if (flagsString.length === 0) {
        return DEFAULT_FLAGS;
    }
    return Array.from(new Set((flagsString + DEFAULT_FLAGS).split(""))).join("");
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

/**
 * Match regExpLikeStrings and return matchPatternResults
 * @param text target text
 * @param regExpLikeStrings an array of pattern string
 */
export const matchPatterns = (text: string, regExpLikeStrings: string[]): matchPatternResult[] => {
    // Create all RegExp first. An invalid pattern throws before matching, as before.
    const regExps = regExpLikeStrings.map((patternString) => createRegExp(patternString));
    const matchPatternResults: matchPatternResult[] = [];
    // A match is `text.slice(startIndex, endIndex)`, so results with the same startIndex and endIndex are duplicated.
    // Remove duplicated results (keep the first one)
    const seen = new Set<string>();
    regExps.forEach((regExp) => {
        const results = text.matchAll(regExp);
        let next = results.next();
        while (!next.done) {
            const result = next.value;
            next = results.next();
            if (result.index === undefined) {
                continue;
            }
            const match = result[0];
            const index = result.index;
            const endIndex = index + match.length;
            const key = `${index}:${endIndex}`;
            if (seen.has(key)) {
                continue;
            }
            seen.add(key);
            matchPatternResults.push({
                match: match,
                captures: result.slice(1), // without match all text - [$1, $2 ...]
                startIndex: index,
                endIndex: endIndex
            });
        }
    });
    // sort by startIndex, then endIndex (Array.prototype.sort is stable since ES2019)
    return matchPatternResults.sort((a, b) => {
        if (a.startIndex !== b.startIndex) {
            return a.startIndex - b.startIndex;
        }
        return a.endIndex - b.endIndex;
    });
};
