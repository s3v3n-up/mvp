import type { Match } from "@/lib/types/Match";

/**
 * email pattern
 */
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&’+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)$/;

/**
 * phone number pattern
 */
export const PHONE_REGEX = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;

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
