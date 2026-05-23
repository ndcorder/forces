'use strict';

const sharp = require('sharp');

const LENGTH_BYTES = 4;
const BITS_PER_BYTE = 8;
const CHANNELS_PER_PIXEL = 3; // R, G, B — alpha is untouched

/**
 * Maximum payload bytes a width×height image can hold.
 * Each pixel contributes 3 LSBs (one per RGB channel).
 * Subtract 4 bytes for the embedded length header.
 */
function maxPayloadSize(width, height) {
  const totalBytes = Math.floor((width * height * CHANNELS_PER_PIXEL) / BITS_PER_BYTE);
  return Math.max(0, totalBytes - LENGTH_BYTES);
}

/**
 * Read a single bit from a byte array.
 */
function getBit(bytes, bitIndex) {
  const byteIndex = bitIndex >> 3;
  const bitShift = 7 - (bitIndex & 7);
  return (bytes[byteIndex] >> bitShift) & 1;
}

/**
 * Write a single bit into a byte array.
 */
function setBit(bytes, bitIndex, bit) {
  const byteIndex = bitIndex >> 3;
  const bitShift = 7 - (bitIndex & 7);
  bytes[byteIndex] = (bytes[byteIndex] & ~(1 << bitShift)) | (bit << bitShift);
}

/**
 * Embed a payload into an image's LSBs.
 *
 * Layout in pixel stream: [4-byte length header (big-endian)][payload bytes]
 * Each bit occupies the LSB of one R, G, or B channel value.
 * Alpha channel is preserved untouched.
 *
 * @param {string|Buffer} image - Path to PNG or buffer.
 * @param {Uint8Array} payload - Data to hide.
 * @returns {Promise<Buffer>} PNG buffer with embedded payload.
 */
async function encode(image, payload) {
  const { data, info } = await sharp(image)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  if (channels < 3) {
    throw new Error('Image must have at least 3 channels (RGB).');
  }

  const maxBytes = maxPayloadSize(width, height);
  if (payload.length > maxBytes) {
    throw new Error(
      `Payload too large (${payload.length} bytes). Maximum for this image: ${maxBytes} bytes. Use a larger image.`
    );
  }

  const pixels = new Uint8Array(data);

  // Build [4-byte big-endian length][payload]
  const fullData = new Uint8Array(LENGTH_BYTES + payload.length);
  new DataView(fullData.buffer).setUint32(0, payload.length, false);
  fullData.set(payload, LENGTH_BYTES);

  const totalBits = fullData.length * BITS_PER_BYTE;
  let bitIndex = 0;

  for (let pixelIndex = 0; pixelIndex < width * height && bitIndex < totalBits; pixelIndex++) {
    const pixelOffset = pixelIndex * channels;

    for (let ch = 0; ch < CHANNELS_PER_PIXEL && bitIndex < totalBits; ch++) {
      pixels[pixelOffset + ch] = (pixels[pixelOffset + ch] & 0xfe) | getBit(fullData, bitIndex);
      bitIndex++;
    }
  }

  return sharp(Buffer.from(pixels), { raw: { width, height, channels } })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

/**
 * Extract a hidden payload from an image's LSBs.
 *
 * @param {string|Buffer} image
 * @returns {Promise<Uint8Array>}
 */
async function decode(image) {
  const { data, info } = await sharp(image)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  if (channels < 3) {
    throw new Error('Image must have at least 3 channels (RGB).');
  }

  const pixels = new Uint8Array(data);
  const totalPixels = width * height;
  const maxPossibleLength = maxPayloadSize(width, height);

  // Read the 4-byte length header from the first 32 LSBs
  const headerBytes = new Uint8Array(LENGTH_BYTES);
  for (let i = 0; i < LENGTH_BYTES * BITS_PER_BYTE; i++) {
    const pixelIndex = Math.floor(i / CHANNELS_PER_PIXEL);
    const ch = i % CHANNELS_PER_PIXEL;
    const lsb = pixels[pixelIndex * channels + ch] & 1;
    setBit(headerBytes, i, lsb);
  }

  const payloadLength = new DataView(headerBytes.buffer).getUint32(0, false);

  if (payloadLength === 0) {
    throw new Error('No hidden payload found in this image.');
  }
  if (payloadLength > maxPossibleLength) {
    throw new Error(
      `Corrupted payload or no hidden data. Declared size ${payloadLength} exceeds capacity.`
    );
  }
  if (payloadLength > 10_000_000) {
    throw new Error(`Suspicious payload size (${payloadLength} bytes). Likely no DeadDrop data.`);
  }

  // Read full data: length header + payload
  const totalBits = (LENGTH_BYTES + payloadLength) * BITS_PER_BYTE;
  const fullData = new Uint8Array(LENGTH_BYTES + payloadLength);

  let bitIndex = 0;
  for (let pixelIndex = 0; pixelIndex < totalPixels && bitIndex < totalBits; pixelIndex++) {
    const pixelOffset = pixelIndex * channels;

    for (let ch = 0; ch < CHANNELS_PER_PIXEL && bitIndex < totalBits; ch++) {
      setBit(fullData, bitIndex, pixels[pixelOffset + ch] & 1);
      bitIndex++;
    }
  }

  return new Uint8Array(fullData.slice(LENGTH_BYTES));
}

/**
 * Quick probe: check if an image likely contains a hidden payload.
 * Reads just the length header from LSBs — no full extraction.
 */
async function probe(image) {
  try {
    const { data, info } = await sharp(image)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const pixels = new Uint8Array(data);
    const maxBytes = maxPayloadSize(width, height);

    const headerBytes = new Uint8Array(LENGTH_BYTES);
    for (let i = 0; i < LENGTH_BYTES * BITS_PER_BYTE; i++) {
      const pixelIndex = Math.floor(i / CHANNELS_PER_PIXEL);
      const ch = i % CHANNELS_PER_PIXEL;
      setBit(headerBytes, i, pixels[pixelIndex * channels + ch] & 1);
    }

    const declaredLength = new DataView(headerBytes.buffer).getUint32(0, false);
    const likelyHasPayload = declaredLength > 0 && declaredLength <= maxBytes && declaredLength <= 10_000_000;

    return { likelyHasPayload, declaredLength };
  } catch {
    return { likelyHasPayload: false, declaredLength: 0 };
  }
}

module.exports = {
  encode,
  decode,
  probe,
  maxPayloadSize,
  LENGTH_BYTES,
  CHANNELS_PER_PIXEL,
  BITS_PER_BYTE,
};
