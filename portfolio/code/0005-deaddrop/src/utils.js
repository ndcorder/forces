'use strict';

const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

/**
 * Check if a file exists and is readable.
 * @param {string} filePath
 * @returns {Promise<boolean>}
 */
async function fileExists(filePath) {
  try {
    await access(filePath, fs.constants.R_OK);
    return true;
  } catch {
    return false;
  }
}

/**
 * Read a file as a Buffer.
 * @param {string} filePath
 * @returns {Promise<Buffer>}
 */
async function readFileBuffer(filePath) {
  const resolved = path.resolve(filePath);
  if (!(await fileExists(resolved))) {
    throw new Error(`File not found: ${resolved}`);
  }
  return readFile(resolved);
}

/**
 * Write data to a file, creating parent directories as needed.
 * @param {string} filePath
 * @param {Buffer|string} data
 */
async function writeFileData(filePath, data) {
  const resolved = path.resolve(filePath);
  await mkdir(path.dirname(resolved), { recursive: true });
  return writeFile(resolved, data);
}

/**
 * Get or create the DeadDrop state directory (~/.deaddrop).
 * @returns {Promise<string>}
 */
async function getStateDir() {
  const homeDir =
    process.env.HOME ||
    process.env.USERPROFILE ||
    process.env.HOMEPATH ||
    process.cwd();
  const stateDir = path.join(homeDir, '.deaddrop');
  await mkdir(stateDir, { recursive: true });
  return stateDir;
}

/**
 * Resolve output path for bury operations.
 * Defaults to <input_name>_buried.<ext>.
 */
function resolveOutputPath(inputPath, outputPath) {
  if (outputPath) return path.resolve(outputPath);
  const parsed = path.parse(path.resolve(inputPath));
  return path.join(parsed.dir, `${parsed.name}_buried${parsed.ext}`);
}

function stringToBytes(str) {
  return new TextEncoder().encode(str);
}

function bytesToString(bytes) {
  return new TextDecoder().decode(bytes);
}

function concatBytes(...arrays) {
  let totalLength = 0;
  for (const arr of arrays) totalLength += arr.length;
  const result = new Uint8Array(totalLength);
  let offset = 0;
  for (const arr of arrays) {
    result.set(arr, offset);
    offset += arr.length;
  }
  return result;
}

/**
 * Parse a YYYY-MM-DD string into a Date at midnight UTC.
 */
function parseDate(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) {
    throw new Error(`Invalid date format: "${dateStr}". Use YYYY-MM-DD.`);
  }
  const date = new Date(Date.UTC(year, month - 1, day));
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date: "${dateStr}".`);
  }
  return date;
}

/**
 * Check whether a date-lock has expired.
 * @returns {{ unlocked: boolean, remainingDays: number, unlockDate: Date }}
 */
function checkDateLock(unlockDateStr) {
  const unlockDate = parseDate(unlockDateStr);
  const now = new Date();
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const diffMs = unlockDate.getTime() - today.getTime();
  const remainingDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return {
    unlocked: remainingDays <= 0,
    remainingDays: Math.max(0, remainingDays),
    unlockDate,
  };
}

/**
 * Validate passphrase meets minimum requirements.
 */
function validatePassphrase(passphrase) {
  if (!passphrase || passphrase.length === 0) {
    return { valid: false, reason: 'Passphrase cannot be empty.' };
  }
  if (passphrase.length < 4) {
    return { valid: false, reason: 'Passphrase must be at least 4 characters.' };
  }
  return { valid: true };
}

module.exports = {
  fileExists,
  readFileBuffer,
  writeFileData,
  getStateDir,
  resolveOutputPath,
  stringToBytes,
  bytesToString,
  concatBytes,
  parseDate,
  checkDateLock,
  validatePassphrase,
};
