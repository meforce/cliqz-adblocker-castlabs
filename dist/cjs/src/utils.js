"use strict";
/*!
 * Copyright (c) 2017-present Cliqz GmbH. All rights reserved.
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasUnicode = exports.binLookup = exports.binSearch = exports.tokenizeRegexInPlace = exports.tokenize = exports.tokenizeWithWildcards = exports.tokenizeNoSkip = exports.tokenizeNoSkipInPlace = exports.tokenizeInPlace = exports.tokenizeWithWildcardsInPlace = exports.isAlpha = exports.isDigit = exports.fastStartsWithFrom = exports.fastStartsWith = exports.hashStrings = exports.fastHash = exports.fastHashBetween = exports.clearBit = exports.setBit = exports.getBit = exports.bitCount = exports.HASH_SEED = void 0;
const tokens_buffer_1 = require("./tokens-buffer");
exports.HASH_SEED = 7877;
/***************************************************************************
 *  Bitwise helpers
 * ************************************************************************* */
// From: https://stackoverflow.com/a/43122214/1185079
function bitCount(n) {
    n = n - ((n >> 1) & 0x55555555);
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
    return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}
exports.bitCount = bitCount;
function getBit(n, mask) {
    return !!(n & mask);
}
exports.getBit = getBit;
function setBit(n, mask) {
    return n | mask;
}
exports.setBit = setBit;
function clearBit(n, mask) {
    return n & ~mask;
}
exports.clearBit = clearBit;
function fastHashBetween(str, begin, end) {
    let hash = exports.HASH_SEED;
    for (let i = begin; i < end; i += 1) {
        hash = (hash * 33) ^ str.charCodeAt(i);
    }
    return hash >>> 0;
}
exports.fastHashBetween = fastHashBetween;
function fastHash(str) {
    if (typeof str !== 'string') {
        return exports.HASH_SEED;
    }
    if (str.length === 0) {
        return exports.HASH_SEED;
    }
    return fastHashBetween(str, 0, str.length);
}
exports.fastHash = fastHash;
function hashStrings(strings) {
    const result = new Uint32Array(strings.length);
    let index = 0;
    for (const str of strings) {
        result[index++] = fastHash(str);
    }
    return result;
}
exports.hashStrings = hashStrings;
// https://jsperf.com/string-startswith/21
function fastStartsWith(haystack, needle) {
    if (haystack.length < needle.length) {
        return false;
    }
    const ceil = needle.length;
    for (let i = 0; i < ceil; i += 1) {
        if (haystack[i] !== needle[i]) {
            return false;
        }
    }
    return true;
}
exports.fastStartsWith = fastStartsWith;
function fastStartsWithFrom(haystack, needle, start) {
    if (haystack.length - start < needle.length) {
        return false;
    }
    const ceil = start + needle.length;
    for (let i = start; i < ceil; i += 1) {
        if (haystack[i] !== needle[i - start]) {
            return false;
        }
    }
    return true;
}
exports.fastStartsWithFrom = fastStartsWithFrom;
function isDigit(ch) {
    // 48 == '0'
    // 57 == '9'
    return ch >= 48 && ch <= 57;
}
exports.isDigit = isDigit;
function isAlpha(ch) {
    // 65 == 'A'
    // 90 == 'Z'
    // 97 == 'a'
    // 122 === 'z'
    return (ch >= 97 && ch <= 122) || (ch >= 65 && ch <= 90);
}
exports.isAlpha = isAlpha;
function isAlphaExtended(ch) {
    // 192 -> 450
    // ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??
    // ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??
    // ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??
    // ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??
    // ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??
    // ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??
    // ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??
    // ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??
    // ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??
    // ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??  ??
    // ??  ??  ??  ??  ??  ??  ??  ??  ??
    return ch >= 192 && ch <= 450;
}
function isCyrillic(ch) {
    // 1024 -> 1279
    // ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ??
    // ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ??
    // ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ??
    // ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ??
    // ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ??
    // ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ??
    // ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ?? ??
    return ch >= 1024 && ch <= 1279;
}
function isAllowedCode(ch) {
    return (isAlpha(ch) || isDigit(ch) || ch === 37 /* '%' */ || isAlphaExtended(ch) || isCyrillic(ch));
}
function tokenizeWithWildcardsInPlace(pattern, skipFirstToken, skipLastToken, buffer) {
    // TODO maybe better to check if buffer is full?
    // Otherwise we are under-using the space.
    const len = Math.min(pattern.length, buffer.remaining() * 2);
    let inside = false;
    let precedingCh = 0;
    let start = 0;
    let hash = exports.HASH_SEED;
    for (let i = 0; i < len; i += 1) {
        const ch = pattern.charCodeAt(i);
        if (isAllowedCode(ch) === true) {
            if (inside === false) {
                hash = exports.HASH_SEED;
                inside = true;
                start = i;
            }
            hash = (hash * 33) ^ ch;
        }
        else {
            if (inside === true) {
                inside = false;
                if (i - start > 1 && // Ignore tokens of 1 character
                    ch !== 42 && // Ignore tokens followed by a '*'
                    precedingCh !== 42 && // Ignore tokens preceeded by a '*'
                    (skipFirstToken === false || start !== 0)) {
                    buffer.push(hash >>> 0);
                }
            }
            precedingCh = ch;
        }
    }
    if (skipLastToken === false &&
        inside === true &&
        precedingCh !== 42 && // Ignore tokens preceeded by a '*'
        pattern.length - start > 1 && // Ignore tokens of 1 character
        buffer.full() === false) {
        buffer.push(hash >>> 0);
    }
}
exports.tokenizeWithWildcardsInPlace = tokenizeWithWildcardsInPlace;
function tokenizeInPlace(pattern, skipFirstToken, skipLastToken, buffer) {
    const len = Math.min(pattern.length, buffer.remaining() * 2);
    let inside = false;
    let start = 0;
    let hash = exports.HASH_SEED;
    for (let i = 0; i < len; i += 1) {
        const ch = pattern.charCodeAt(i);
        if (isAllowedCode(ch) === true) {
            if (inside === false) {
                hash = exports.HASH_SEED;
                inside = true;
                start = i;
            }
            hash = (hash * 33) ^ ch;
        }
        else if (inside === true) {
            inside = false;
            if (i - start > 1 && // Ignore tokens of 1 character
                (skipFirstToken === false || start !== 0)) {
                buffer.push(hash >>> 0);
            }
        }
    }
    if (inside === true &&
        skipLastToken === false &&
        pattern.length - start > 1 && // Ignore tokens of 1 character
        buffer.full() === false) {
        buffer.push(hash >>> 0);
    }
}
exports.tokenizeInPlace = tokenizeInPlace;
function tokenizeNoSkipInPlace(pattern, buffer) {
    const len = Math.min(pattern.length, buffer.remaining() * 2);
    let inside = false;
    let start = 0;
    let hash = exports.HASH_SEED;
    for (let i = 0; i < len; i += 1) {
        const ch = pattern.charCodeAt(i);
        if (isAllowedCode(ch) === true) {
            if (inside === false) {
                hash = exports.HASH_SEED;
                inside = true;
                start = i;
            }
            hash = (hash * 33) ^ ch;
        }
        else if (inside === true) {
            inside = false;
            if (i - start > 1) {
                buffer.push(hash >>> 0);
            }
        }
    }
    if (inside === true && pattern.length - start > 1 && buffer.full() === false) {
        buffer.push(hash >>> 0);
    }
}
exports.tokenizeNoSkipInPlace = tokenizeNoSkipInPlace;
function tokenizeNoSkip(pattern) {
    tokens_buffer_1.TOKENS_BUFFER.reset();
    tokenizeNoSkipInPlace(pattern, tokens_buffer_1.TOKENS_BUFFER);
    return tokens_buffer_1.TOKENS_BUFFER.slice();
}
exports.tokenizeNoSkip = tokenizeNoSkip;
function tokenizeWithWildcards(pattern, skipFirstToken, skipLastToken) {
    tokens_buffer_1.TOKENS_BUFFER.reset();
    tokenizeWithWildcardsInPlace(pattern, skipFirstToken, skipLastToken, tokens_buffer_1.TOKENS_BUFFER);
    return tokens_buffer_1.TOKENS_BUFFER.slice();
}
exports.tokenizeWithWildcards = tokenizeWithWildcards;
function tokenize(pattern, skipFirstToken, skipLastToken) {
    tokens_buffer_1.TOKENS_BUFFER.reset();
    tokenizeInPlace(pattern, skipFirstToken, skipLastToken, tokens_buffer_1.TOKENS_BUFFER);
    return tokens_buffer_1.TOKENS_BUFFER.slice();
}
exports.tokenize = tokenize;
function tokenizeRegexInPlace(selector, tokens) {
    let end = selector.length - 1;
    let begin = 1;
    let prev = 0;
    // Try to find the longest safe *prefix* that we can tokenize
    for (; begin < end; begin += 1) {
        const code = selector.charCodeAt(begin);
        // If we encounter '|' before any other opening bracket, then it's not safe
        // to tokenize this filter (e.g.: 'foo|bar'). Instead we abort tokenization
        // to be safe.
        if (code === 124 /* '|' */) {
            return;
        }
        if (code === 40 /* '(' */ ||
            code === 42 /* '*' */ ||
            code === 43 /* '+' */ ||
            code === 63 /* '?' */ ||
            code === 91 /* '[' */ ||
            code === 123 /* '{' */ ||
            (code === 46 /* '.' */ && prev !== 92) /* '\' */ ||
            (code === 92 /* '\' */ && isAlpha(selector.charCodeAt(begin + 1)))) {
            break;
        }
        prev = code;
    }
    // Try to find the longest safe *suffix* that we can tokenize
    prev = 0;
    for (; end >= begin; end -= 1) {
        const code = selector.charCodeAt(end);
        // If we encounter '|' before any other opening bracket, then it's not safe
        // to tokenize this filter (e.g.: 'foo|bar'). Instead we abort tokenization
        // to be safe.
        if (code === 124 /* '|' */) {
            return;
        }
        if (code === 41 /* ')' */ ||
            code === 42 /* '*' */ ||
            code === 43 /* '+' */ ||
            code === 63 /* '?' */ ||
            code === 93 /* ']' */ ||
            code === 125 /* '}' */ ||
            (code === 46 /* '.' */ && selector.charCodeAt(end - 1) !== 92) /* '\' */ ||
            (code === 92 /* '\' */ && isAlpha(prev))) {
            break;
        }
        prev = code;
    }
    if (end < begin) {
        // Full selector is safe
        const skipFirstToken = selector.charCodeAt(1) !== 94; /* '^' */
        const skipLastToken = selector.charCodeAt(selector.length - 1) !== 36; /* '$' */
        tokenizeInPlace(selector.slice(1, selector.length - 1), skipFirstToken, skipLastToken, tokens);
    }
    else {
        // Tokenize prefix
        if (begin > 1) {
            tokenizeInPlace(selector.slice(1, begin), selector.charCodeAt(1) !== 94 /* '^' */, // skipFirstToken
            true, tokens);
        }
        // Tokenize suffix
        if (end < selector.length - 1) {
            tokenizeInPlace(selector.slice(end + 1, selector.length - 1), true, selector.charCodeAt(selector.length - 1) !== 94 /* '^' */, // skipLastToken
            tokens);
        }
    }
}
exports.tokenizeRegexInPlace = tokenizeRegexInPlace;
function binSearch(arr, elt) {
    if (arr.length === 0) {
        return -1;
    }
    let low = 0;
    let high = arr.length - 1;
    while (low <= high) {
        const mid = (low + high) >>> 1;
        const midVal = arr[mid];
        if (midVal < elt) {
            low = mid + 1;
        }
        else if (midVal > elt) {
            high = mid - 1;
        }
        else {
            return mid;
        }
    }
    return -1;
}
exports.binSearch = binSearch;
function binLookup(arr, elt) {
    return binSearch(arr, elt) !== -1;
}
exports.binLookup = binLookup;
const hasUnicodeRe = /[^\u0000-\u00ff]/;
function hasUnicode(str) {
    return hasUnicodeRe.test(str);
}
exports.hasUnicode = hasUnicode;
//# sourceMappingURL=utils.js.map