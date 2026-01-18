// generate random bytes
// take 5 bits at a time
// do a base32 encoding
// use that index to get a value from the ALPHABET array


import crypto from "crypto";

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // length = 32

export function generateString(length: number) {
    const bytesNeeded = Math.ceil((length * 5) / 8);
    const randomBytes = crypto.randomBytes(bytesNeeded);

    let value = 0;
    let bits = 0;
    let output = "";

    for (const byte of randomBytes) {
        value = value << 8 | byte; // move 8 bits left and or with byte basically appending 8 bytes to the end.
        bits = bits + 8; // increase bit count.

        while (bits >= 5 && output.length < length) {
            const index = (value >> (bits - 5)) & 31; // 31 is basically 11111, it gives only 5 bits good for base32 encding.
            bits -= 5;
            output += ALPHABET[index];
        }
    }

    return output;
}
