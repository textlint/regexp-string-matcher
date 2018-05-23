import { matchPatterns } from "../src/regexp-string-matcher";
import * as assert from "assert";

describe("Failure Case", () => {
    it(`Empty string should be thrown`, () => {
        assert.throws(() => {
            matchPatterns("text", [""]);
        }, Error);
    });
});
