'use strict';

const {
  encrypt,
  decrypt,
  isDeadDropPayload,
  inspectPayload,
  payloadFingerprint,
  MAGIC,
  FLAG_DATE_LOCK,
  FLAG_TESTAMENT,
} = require('../src/crypto');

describe('crypto', () => {
  const PASSPHRASE = 'archaeology';
  const MESSAGE = 'The dead carry messages.';

  describe('encrypt', () => {
    it('should start with magic bytes', async () => {
      const p = await encrypt(MESSAGE, PASSPHRASE);
      expect(p[0]).toBe(0xde);
      expect(p[1]).toBe(0xad);
      expect(p[2]).toBe(0x00);
      expect(p[3]).toBe(0x01);
    });

    it('should set flags to 0 when no options', async () => {
      const p = await encrypt(MESSAGE, PASSPHRASE);
      expect(p[MAGIC.length]).toBe(0);
    });

    it('should set date-lock flag', async () => {
      const p = await encrypt(MESSAGE, PASSPHRASE, { unlockDate: '2099-01-01' });
      expect(p[MAGIC.length] & FLAG_DATE_LOCK).toBe(FLAG_DATE_LOCK);
    });

    it('should set testament flag', async () => {
      const p = await encrypt(MESSAGE, PASSPHRASE, { testament: true });
      expect(p[MAGIC.length] & FLAG_TESTAMENT).toBe(FLAG_TESTAMENT);
    });

    it('should set both flags simultaneously', async () => {
      const p = await encrypt(MESSAGE, PASSPHRASE, { unlockDate: '2099-06-15', testament: true });
      const flags = p[MAGIC.length];
      expect(flags & FLAG_DATE_LOCK).toBe(FLAG_DATE_LOCK);
      expect(flags & FLAG_TESTAMENT).toBe(FLAG_TESTAMENT);
    });

    it('should produce unique ciphertexts for identical inputs (random salt/iv)', async () => {
      const p1 = await encrypt(MESSAGE, PASSPHRASE);
      const p2 = await encrypt(MESSAGE, PASSPHRASE);
      expect(Buffer.from(p1).equals(Buffer.from(p2))).toBe(false);
    });

    it('should handle empty messages', async () => {
      const p = await encrypt('', PASSPHRASE);
      const r = await decrypt(p, PASSPHRASE);
      expect(r.plaintext).toBe('');
    });

    it('should handle long messages', async () => {
      const long = 'A'.repeat(50_000);
      const p = await encrypt(long, PASSPHRASE);
      const r = await decrypt(p, PASSPHRASE);
      expect(r.plaintext).toBe(long);
    });

    it('should handle unicode', async () => {
      const msg = '暗号化された秘密 🔒 العربية';
      const p = await encrypt(msg, PASSPHRASE);
      const r = await decrypt(p, PASSPHRASE);
      expect(r.plaintext).toBe(msg);
    });

    it('should encode date as 4 bytes (year uint16 BE, month uint8, day uint8)', async () => {
      const p = await encrypt(MESSAGE, PASSPHRASE, { unlockDate: '2025-03-14' });
      const dateOffset = MAGIC.length + 1 + 32 + 16;
      const view = new DataView(p.buffer, p.byteOffset + dateOffset, 4);
      expect(view.getUint16(0)).toBe(2025);
      expect(p[dateOffset + 2]).toBe(3);
      expect(p[dateOffset + 3]).toBe(14);
    });

    it('date-locked payload should be 4 bytes larger than unlocked', async () => {
      const pNo = await encrypt(MESSAGE, PASSPHRASE);
      const pYes = await encrypt(MESSAGE, PASSPHRASE, { unlockDate: '2030-01-01' });
      expect(pYes.length).toBe(pNo.length + 4);
    });
  });

  describe('decrypt', () => {
    it('should recover plaintext with correct passphrase', async () => {
      const p = await encrypt(MESSAGE, PASSPHRASE);
      const r = await decrypt(p, PASSPHRASE);
      expect(r.plaintext).toBe(MESSAGE);
    });

    it('should reject wrong passphrase', async () => {
      const p = await encrypt(MESSAGE, PASSPHRASE);
      await expect(decrypt(p, 'wrong')).rejects.toThrow('Wrong passphrase or corrupted payload');
    });

    it('should reject truncated payload', async () => {
      const p = await encrypt(MESSAGE, PASSPHRASE);
      await expect(decrypt(p.slice(0, p.length - 5), PASSPHRASE)).rejects.toThrow();
    });

    it('should reject payload shorter than magic', async () => {
      await expect(decrypt(new Uint8Array([0xde, 0xad]), PASSPHRASE)).rejects.toThrow('too short');
    });

    it('should reject invalid magic bytes', async () => {
      const fake = new Uint8Array(100);
      fake[0] = 0xff;
      await expect(decrypt(fake, PASSPHRASE)).rejects.toThrow('Not a valid DeadDrop');
    });

    it('should return unlockDate from date-locked payload', async () => {
      const p = await encrypt(MESSAGE, PASSPHRASE, { unlockDate: '2042-12-25' });
      const r = await decrypt(p, PASSPHRASE);
      expect(r.unlockDate).toBe('2042-12-25');
      expect(r.isTestament).toBe(false);
      expect((r.flags & FLAG_DATE_LOCK) !== 0).toBe(true);
    });

    it('should return null unlockDate when unlocked', async () => {
      const p = await encrypt(MESSAGE, PASSPHRASE);
      const r = await decrypt(p, PASSPHRASE);
      expect(r.unlockDate).toBeNull();
    });

    it('should detect testament mode', async () => {
      const p = await encrypt(MESSAGE, PASSPHRASE, { testament: true });
      const r = await decrypt(p, PASSPHRASE);
      expect(r.isTestament).toBe(true);
    });

    it('should handle both date-lock and testament', async () => {
      const p = await encrypt(MESSAGE, PASSPHRASE, { unlockDate: '2050-07-20', testament: true });
      const r = await decrypt(p, PASSPHRASE);
      expect(r.plaintext).toBe(MESSAGE);
      expect(r.unlockDate).toBe('2050-07-20');
      expect(r.isTestament).toBe(true);
    });
  });

  describe('roundtrip', () => {
    const cases = [
      ['ASCII', 'hello world'],
      ['newlines', 'line one\nline two\nline three'],
      ['special chars', '!@#$%^&*()_+-=[]{}|;:,.<>?'],
      ['emoji', '🔐 buried treasure 💀'],
      ['CJK', '秘密のメッセージ'],
      ['tabs and CR', 'col1\tcol2\r\nrow2'],
      ['single char', 'x'],
      ['JSON', '{"key": "value", "nested": {"deep": true}}'],
    ];

    test.each(cases)('roundtrip: %s', async (_, msg) => {
      const p = await encrypt(msg, PASSPHRASE);
      const r = await decrypt(p, PASSPHRASE);
      expect(r.plaintext).toBe(msg);
    });
  });

  describe('isDeadDropPayload', () => {
    it('returns true for valid payload', async () => {
      const p = await encrypt('test', PASSPHRASE);
      expect(isDeadDropPayload(p)).toBe(true);
    });

    it('returns false for random data', () => {
      expect(isDeadDropPayload(new Uint8Array(100))).toBe(false);
    });

    it('returns false for null/undefined/short', () => {
      expect(isDeadDropPayload(null)).toBe(false);
      expect(isDeadDropPayload(undefined)).toBe(false);
      expect(isDeadDropPayload(new Uint8Array([0xde, 0xad]))).toBe(false);
    });
  });

  describe('inspectPayload', () => {
    it('reports no flags for plain payload', async () => {
      const p = await encrypt('test', PASSPHRASE);
      const m = inspectPayload(p);
      expect(m.hasDateLock).toBe(false);
      expect(m.isTestament).toBe(false);
      expect(m.unlockDate).toBeNull();
    });

    it('reports date-lock', async () => {
      const p = await encrypt('test', PASSPHRASE, { unlockDate: '2035-09-01' });
      const m = inspectPayload(p);
      expect(m.hasDateLock).toBe(true);
      expect(m.unlockDate).toBe('2035-09-01');
    });

    it('reports testament', async () => {
      const p = await encrypt('test', PASSPHRASE, { testament: true });
      const m = inspectPayload(p);
      expect(m.isTestament).toBe(true);
    });

    it('reports both flags', async () => {
      const p = await encrypt('test', PASSPHRASE, { unlockDate: '2040-11-30', testament: true });
      const m = inspectPayload(p);
      expect(m.hasDateLock).toBe(true);
      expect(m.unlockDate).toBe('2040-11-30');
      expect(m.isTestament).toBe(true);
    });

    it('throws for invalid payload', () => {
      expect(() => inspectPayload(new Uint8Array(50))).toThrow('Not a valid DeadDrop');
    });
  });

  describe('payloadFingerprint', () => {
    it('returns 16-char hex string', async () => {
      const p = await encrypt('test', PASSPHRASE);
      expect(payloadFingerprint(p)).toMatch(/^[0-9a-f]{16}$/);
    });

    it('is deterministic', async () => {
      const p = await encrypt('test', PASSPHRASE);
      expect(payloadFingerprint(p)).toBe(payloadFingerprint(p));
    });

    it('differs for different payloads', async () => {
      const p1 = await encrypt('A', PASSPHRASE);
      const p2 = await encrypt('B', PASSPHRASE);
      expect(payloadFingerprint(p1)).not.toBe(payloadFingerprint(p2));
    });
  });
});
