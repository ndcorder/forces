'use strict';

const sharp = require('sharp');
const { encode, decode, probe, maxPayloadSize } = require('../src/steg');
const { MAGIC } = require('../src/crypto');

async function createTestImage(width, height) {
  const channels = 4;
  const pixels = Buffer.alloc(width * height * channels);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * channels;
      pixels[idx] = (x * 7) & 0xff;
      pixels[idx + 1] = (y * 13) & 0xff;
      pixels[idx + 2] = ((x + y) * 3) & 0xff;
      pixels[idx + 3] = 255;
    }
  }
  return sharp(pixels, { raw: { width, height, channels } }).png().toBuffer();
}

describe('steg', () => {
  describe('maxPayloadSize', () => {
    it('10x10 image', () => {
      expect(maxPayloadSize(10, 10)).toBe(33);
    });

    it('100x100 image', () => {
      expect(maxPayloadSize(100, 100)).toBe(3746);
    });

    it('1x1 image has zero capacity', () => {
      expect(maxPayloadSize(1, 1)).toBe(0);
    });

    it('2x2 image has zero capacity', () => {
      expect(maxPayloadSize(2, 2)).toBe(0);
    });
  });

  describe('encode/decode roundtrip', () => {
    let img;

    beforeAll(async () => {
      img = await createTestImage(64, 64);
    });

    it('roundtrips a short payload', async () => {
      const payload = new Uint8Array([0x01, 0x02, 0x03, 0x04, 0x05]);
      const encoded = await encode(img, payload);
      const decoded = await decode(encoded);
      expect(decoded).toEqual(payload);
    });

    it('roundtrips a DeadDrop-like payload', async () => {
      const payload = new Uint8Array([
        ...MAGIC, 0x01,
        ...new Uint8Array(32).fill(0xaa), // salt
        ...new Uint8Array(16).fill(0xbb), // iv
        ...new Uint8Array(20).fill(0xcc), // ciphertext
        ...new Uint8Array(16).fill(0xdd), // tag
      ]);
      const encoded = await encode(img, payload);
      const decoded = await decode(encoded);
      expect(decoded).toEqual(payload);
    });

    it('roundtrips a single byte', async () => {
      const payload = new Uint8Array([0x42]);
      expect(await decode(await encode(img, payload))).toEqual(payload);
    });

    it('roundtrips all-zeros', async () => {
      const payload = new Uint8Array(100);
      expect(await decode(await encode(img, payload))).toEqual(payload);
    });

    it('roundtrips all-0xff', async () => {
      const payload = new Uint8Array(100).fill(0xff);
      expect(await decode(await encode(img, payload))).toEqual(payload);
    });

    it('roundtrips alternating bits', async () => {
      const payload = new Uint8Array(50);
      for (let i = 0; i < 50; i++) payload[i] = i % 2 === 0 ? 0xaa : 0x55;
      expect(await decode(await encode(img, payload))).toEqual(payload);
    });

    it('roundtrips max capacity', async () => {
      const cap = maxPayloadSize(64, 64);
      const payload = new Uint8Array(cap);
      for (let i = 0; i < cap; i++) payload[i] = (i * 7 + 3) & 0xff;
      const decoded = await decode(await encode(img, payload));
      expect(decoded.length).toBe(cap);
      expect(decoded).toEqual(payload);
    });

    it('roundtrips random data', async () => {
      const payload = new Uint8Array(500);
      for (let i = 0; i < 500; i++) payload[i] = Math.floor(Math.random() * 256);
      expect(await decode(await encode(img, payload))).toEqual(payload);
    });

    it('produces valid PNG output', async () => {
      const encoded = await encode(img, new Uint8Array([1, 2, 3]));
      const meta = await sharp(encoded).metadata();
      expect(meta.format).toBe('png');
      expect(meta.width).toBe(64);
      expect(meta.height).toBe(64);
    });

    it('preserves dimensions', async () => {
      const encoded = await encode(img, new Uint8Array(10));
      const { info } = await sharp(encoded).raw().toBuffer({ resolveWithObject: true });
      expect(info.width).toBe(64);
      expect(info.height).toBe(64);
    });

    it('only modifies LSBs, preserves alpha', async () => {
      const origRaw = new Uint8Array(await sharp(img).ensureAlpha().raw().toBuffer());
      const encoded = await encode(img, new Uint8Array(100).fill(0x55));
      const encRaw = new Uint8Array(await sharp(encoded).ensureAlpha().raw().toBuffer());

      for (let i = 0; i < 64 * 64; i++) {
        // Alpha unchanged
        expect(encRaw[i * 4 + 3]).toBe(origRaw[i * 4 + 3]);
        // RGB differs by at most 1
        for (let ch = 0; ch < 3; ch++) {
          expect(Math.abs(encRaw[i * 4 + ch] - origRaw[i * 4 + ch])).toBeLessThanOrEqual(1);
        }
      }
    });
  });

  describe('encode errors', () => {
    it('rejects oversized payload', async () => {
      const small = await createTestImage(5, 5);
      await expect(encode(small, new Uint8Array(100))).rejects.toThrow('Payload too large');
    });

    it('rejects payload on zero-capacity image', async () => {
      const tiny = await createTestImage(1, 1);
      await expect(encode(tiny, new Uint8Array([1]))).rejects.toThrow();
    });
  });

  describe('decode errors', () => {
    it('rejects clean image', async () => {
      const clean = await createTestImage(64, 64);
      await expect(decode(clean)).rejects.toThrow();
    });

    it('rejects image with all-1 LSBs (declares huge length)', async () => {
      const w = 10, h = 10, ch = 4;
      const pixels = Buffer.alloc(w * h * ch);
      for (let i = 0; i < w * h; i++) {
        pixels[i * ch] = 0xff;
        pixels[i * ch + 1] = 0xff;
        pixels[i * ch + 2] = 0xff;
        pixels[i * ch + 3] = 255;
      }
      const bad = await sharp(pixels, { raw: { width: w, height: h, channels: ch } }).png().toBuffer();
      await expect(decode(bad)).rejects.toThrow();
    });
  });

  describe('probe', () => {
    it('detects encoded image', async () => {
      const image = await createTestImage(64, 64);
      const payload = new Uint8Array([0xde, 0xad, 0x00, 0x01, 0x00, 0x42]);
      const encoded = await encode(image, payload);
      const result = await probe(encoded);
      expect(result.likelyHasPayload).toBe(true);
      expect(result.declaredLength).toBe(6);
    });

    it('reports correct declared length', async () => {
      const image = await createTestImage(64, 64);
      const encoded = await encode(image, new Uint8Array(200).fill(0xab));
      expect((await probe(encoded)).declaredLength).toBe(200);
    });

    it('returns false for clean image', async () => {
      const clean = await createTestImage(64, 64);
      expect((await probe(clean)).likelyHasPayload).toBe(false);
    });

    it('handles tiny images gracefully', async () => {
      const tiny = await createTestImage(2, 2);
      const result = await probe(tiny);
      expect(typeof result.likelyHasPayload).toBe('boolean');
    });
  });

  describe('edge cases', () => {
    it('overwriting an encoded image yields the second payload', async () => {
      const image = await createTestImage(128, 128);
      const encoded1 = await encode(image, new Uint8Array(100).fill(0x11));
      const encoded2 = await encode(encoded1, new Uint8Array(50).fill(0x22));
      const decoded = await decode(encoded2);
      expect(decoded.length).toBe(50);
      expect(decoded.every(b => b === 0x22)).toBe(true);
    });

    it('works with non-square images', async () => {
      for (const [w, h] of [[16, 16], [32, 64], [100, 50]]) {
        const image = await createTestImage(w, h);
        const payload = new Uint8Array([0xca, 0xfe, 0xba, 0xbe]);
        expect(await decode(await encode(image, payload))).toEqual(payload);
      }
    });
  });
});
