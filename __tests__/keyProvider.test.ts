import {
  getRootKey,
  getDescendantKey,
  keyIsNextSibling,
} from '../src/keyProvider';

describe('keyProvider', () => {
  describe('getRootKey', () => {
    [0, 1, 2].forEach((index) => {
      it(`should be code-segment-${index}`, () => {
        expect(getRootKey(index)).toBe(`code-segment-${index}`);
      });
    });
  });

  describe('getDescendantKey', () => {
    [0, 1, 2].forEach((index) => {
      it(`should be parent-${index}`, () => {
        expect(getDescendantKey('theparentkey', index)).toBe(
          `theparentkey-${index}`
        );
      });
    });
  });

  describe('keyIsNextSibling', () => {
    it('should return true if nextSibling', () => {
      expect(keyIsNextSibling('code-segment-0', 'code-segment-1')).toBe(true);
    });

    [
      'code-segment-0',
      'code-segment-2',
      'code-segment-0-0',
      'code-segment-0-1',
    ].forEach((notNextSibling) => {
      it(`should return false if not nextSibling - ${notNextSibling}`, () => {
        expect(keyIsNextSibling('code-segment-0', 'code-segment-2')).toBe(
          false
        );
      });
    });
  });
});
