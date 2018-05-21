import uniq = require("lodash.uniq");
import uniqWith = require("lodash.uniqwith");
import sortBy = require("lodash.sortby");

const execall = require("execall");
const toRegex = require("to-regex");
const REGEXP_LITERAL_PATTERN = /^\/(.*)\/([guimy]*)$/;
const parseRegExpString = (str: string): { source: string; flagString: string } | null => {
    const result = str.match(REGEXP_LITERAL_PATTERN);
    if (!result) {
        return null;
    }
    return {
        source: result[1],
        flagString: result[2]
    };
};
const isRegExpString = (str: string): boolean => {
    return REGEXP_LITERAL_PATTERN.test(str);
};
const DEFAULT_FLAGS = "g";

const defaultFlags = (flagsString: string) => {
    if (flagsString.length === 0) {
        return DEFAULT_FLAGS;
    }
    return uniq((flagsString + DEFAULT_FLAGS).split("")).join("");
};

export interface matchPatternResult {
    match: string;
    startIndex: number;
    endIndex: number;
}

const createRegExp = (patternString: string): RegExp => {
    if (patternString.length === 0) {
        throw new Error("Emtpy string can not includes");
    }
    if (isRegExpString(patternString)) {
        const regExpStructure = parseRegExpString(patternString);
        if (regExpStructure) {
            return toRegex(regExpStructure.source, {
                flags: defaultFlags(regExpStructure.flagString),
                contains: true
            });
        }
        throw new Error(`"${patternString}" can not parse as RegExp.`);
    } else {
        return toRegex(patternString, {
            flags: DEFAULT_FLAGS,
            contains: true
        });
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
        .map(patternString => {
            return createRegExp(patternString);
        })
        .forEach(regExp => {
            const execallResults = execall(regExp, text);
            execallResults.forEach((result: { match: string; index: number; sub: string[] }) => {
                const match = result.match;
                const index = result.index;
                matchPatternResults.push({
                    match: match,
                    startIndex: index,
                    endIndex: index + match.length
                });
            });
        });
    const uniqResults = uniqWith(matchPatternResults, isEqualMatchPatternResult);
    return sortBy(uniqResults, ["startIndex", "endIndex"]);
};
