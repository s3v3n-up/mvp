import type { Match } from "@/lib/types/Match";

/**
 * validate a match object
 * @param match - match to validate
 * @throws {Error} if match is invalid
 * return {Match} - validated match
 */
export function validateMatch(match: Match) {
    const { matchHost, sport, matchType, matchStart, matchEnd, description } = match;

    //check if all required match's properties are defined
    if (!matchHost || !sport || !matchType || !matchStart || !matchEnd || !description) {
        throw new Error("missing required match property");
    }

    return match;
}