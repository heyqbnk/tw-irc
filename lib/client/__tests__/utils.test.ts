import { generateRandomLogin } from '../utils';

describe('client', () => {
  describe('utils', () => {
    it('generateRandomLogin returns a string starting with "justinfan"', () => {
      expect(generateRandomLogin()).toMatch(/^justinfan/);
    });
  });
});
