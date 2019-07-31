import {
  generateRandomAuth,
  warnInvalidPassword,
  isPasswordValid,
} from '../utils';

describe('client', () => {
  describe('utils', () => {
    describe('generateRandomAuth', () => {
      it('should return an object with fields login and password.', () => {
        expect(generateRandomAuth()).toEqual({
          login: expect.any(String),
          password: expect.any(String),
        });
      });
    });

    describe('isPasswordValid', () => {
      it('should return true if password starts with "oauth:". ' +
        'Otherwise, returns false.', () => {
        expect(isPasswordValid('oauth:jvlkas')).toBe(true);
        expect(isPasswordValid('husky-woof!')).toBe(false);
      });
    });

    describe('warnInvalidPassword', () => {
      it('should call console.warn with warning message', () => {
        const spy = jest.spyOn(global.console, 'warn');
        warnInvalidPassword('Leonardo Da Vinci');

        expect(spy).toHaveBeenCalledWith(expect.any(String));
      });
    });
  });
});
