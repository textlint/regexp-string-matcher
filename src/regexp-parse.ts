// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions#advanced_searching_with_flags
const REGEXP_LITERAL_PATTERN = /^\/(.+)\/([guimysd]*)$/;
export const parseRegExpString = (str: string): { source: string; flagString: string } | null => {
    const result = str.match(REGEXP_LITERAL_PATTERN);
    if (!result) {
        return null;
    }
    return {
        source: result[1],
        flagString: result[2]
    };
};
export const isRegExpString = (str: string): boolean => {
    return REGEXP_LITERAL_PATTERN.test(str);
};
