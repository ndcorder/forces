'use strict';

const crypto = require('crypto');
const { stringToBytes, bytesToString, concatBytes, parseDate } = require('./utils');

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;
const IV_LENGTH = 16;
const SALT_LENGTH = 32;
const TAG_LENGTH = 16;
const PBKDF2_ITERATIONS = 600000;

// Magic bytes identifying DeadDrop payloads
const MAGIC = new Uint8Array([0xde, 0xad, 0x00, 0x01]);

// Flags byte: bit 0 = date-lock, bit 1 = testament
const FLAG_DATE_LOCK = 0x01;
const FLAG_TESTAMENT = 0x02;

/**
 * Derive a 256-bit key from passphrase + salt via PBKDF2.
 */
async function deriveKey(passphrase, salt) {
  return new Promise((resolve, reject) => {
    crypto.pbkdf2(passphrase, salt, PBKDF2_ITERATIONS, KEY_LENGTH, 'sha512', (err, key) => {
      if (err) reject(err);
      else resolve(new Uint8Array(key));
    });
  });
}

/**
 * Encrypt a plaintext message with AES-256-GCM.
 *
 * Payload layout:
 *   [MAGIC: 4B][FLAGS: 1B][SALT: 32B][IV: 16B][LOCK_DATE: 0 or 4B][CIPHERTEXT: var][TAG: 16B]
 *
 * Lock date encoding: year (uint16 BE) + month (uint8) + day (uint8) = 4 bytes.
 *
 * @param {string} plaintext
 * @param {string} passphrase
 * @param {Object} [options]
 * @param {string} [options.unlockDate] - YYYY-MM-DD
 * @param {boolean} [options.testament]
 * @returns {Promise<Uint8Array>}
 */
async function encrypt(plaintext, passphrase, options = {}) {
  const salt = new Uint8Array(crypto.randomBytes(SALT_LENGTH));
  const iv = new Uint8Array(crypto.randomBytes(IV_LENGTH));
  const key = await deriveKey(passphrase, salt);

  let flags = 0;
  if (options.unlockDate) flags |= FLAG_DATE_LOCK;
  if (options.testament) flags |= FLAG_TESTAMENT;

  let lockDateBytes = new Uint8Array(0);
  if (options.unlockDate) {
    const d = parseDate(options.unlockDate);
    lockDateBytes = new Uint8Array(4);
    const view = new DataView(lockDateBytes.buffer);
    view.setUint16(0, d.getUTCFullYear());
    lockDateBytes[2] = d.getUTCMonth() + 1;
    lockDateBytes[3] = d.getUTCDate();
  }

  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
  const encrypted = Buffer.concat([cipher.update(stringToBytes(plaintext)), cipher.final()]);
  const tag = new Uint8Array(cipher.getAuthTag());

  return concatBytes(MAGIC, new Uint8Array([flags]), salt, iv, lockDateBytes, encrypted, tag);
}

/**
 * Decrypt a DeadDrop payload.
 *
 * @param {Uint8Array} payload
 * @param {string} passphrase
 * @returns {Promise<{ plaintext: string, flags: number, unlockDate: string|null, isTestament: boolean }>}
 */
async function decrypt(payload, passphrase) {
  if (payload.length < MAGIC.length) {
    throw new Error('Payload too short to be a DeadDrop.');
  }
  for (let i = 0; i < MAGIC.length; i++) {
    if (payload[i] !== MAGIC[i]) {
      throw new Error('Not a valid DeadDrop payload.');
    }
  }

  let offset = MAGIC.length;

  const flags = payload[offset];
  offset += 1;

  const hasDateLock = (flags & FLAG_DATE_LOCK) !== 0;
  const isTestament = (flags & FLAG_TESTAMENT) !== 0;

  const salt = payload.slice(offset, offset + SALT_LENGTH);
  offset += SALT_LENGTH;

  const iv = payload.slice(offset, offset + IV_LENGTH);
  offset += IV_LENGTH;

  let unlockDate = null;
  if (hasDateLock) {
    const view = new DataView(payload.buffer, payload.byteOffset + offset, 4);
    const year = view.getUint16(0);
    const month = payload[offset + 2];
    const day = payload[offset + 3];
    unlockDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    offset += 4;
  }

  const tag = payload.slice(payload.length - TAG_LENGTH);
  const ciphertext = payload.slice(offset, payload.length - TAG_LENGTH);

  const key = await deriveKey(passphrase, salt);
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, { authTagLength: TAG_LENGTH });
  decipher.setAuthTag(tag);

  try {
    const decrypted = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
    return { plaintext: bytesToString(decrypted), flags, unlockDate, isTestament };
  } catch (err) {
    if (err.message.includes('Unsupported state') || err.message.includes('auth tag')) {
      throw new Error('Wrong passphrase or corrupted payload.');
    }
    throw err;
  }
}

/**
 * Quick magic-byte check.
 */
function isDeadDropPayload(data) {
  if (!data || data.length < MAGIC.length) return false;
  for (let i = 0; i < MAGIC.length; i++) {
    if (data[i] !== MAGIC[i]) return false;
  }
  return true;
}

/**
 * Read metadata from payload without decrypting.
 */
function inspectPayload(payload) {
  if (!isDeadDropPayload(payload)) {
    throw new Error('Not a valid DeadDrop payload.');
  }

  const flags = payload[MAGIC.length];
  const hasDateLock = (flags & FLAG_DATE_LOCK) !== 0;
  const isTestament = (flags & FLAG_TESTAMENT) !== 0;

  let unlockDate = null;
  if (hasDateLock) {
    const dateOffset = MAGIC.length + 1 + SALT_LENGTH + IV_LENGTH;
    const view = new DataView(payload.buffer, payload.byteOffset + dateOffset, 4);
    const year = view.getUint16(0);
    const month = payload[dateOffset + 2];
    const day = payload[dateOffset + 3];
    unlockDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  }

  return { hasDateLock, isTestament, unlockDate };
}

/**
 * Compute a short fingerprint for testament state tracking.
 * Samples first 64 and last 16 bytes of the payload.
 */
function payloadFingerprint(payload) {
  const sample = concatBytes(
    payload.slice(0, Math.min(64, payload.length)),
    payload.slice(Math.max(0, payload.length - 16))
  );
  return crypto.createHash('sha256').update(sample).digest('hex').slice(0, 16);
}

module.exports = {
  ALGORITHM,
  KEY_LENGTH,
  IV_LENGTH,
  SALT_LENGTH,
  TAG_LENGTH,
  PBKDF2_ITERATIONS,
  MAGIC,
  FLAG_DATE_LOCK,
  FLAG_TESTAMENT,
  encrypt,
  decrypt,
  isDeadDropPayload,
  inspectPayload,
  payloadFingerprint,
};
