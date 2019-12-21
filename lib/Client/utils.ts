import {IAuthInfo} from '../types';

/**
 * Generates random authentication data.
 * @returns {string}
 */
export function generateRandomAuth(): IAuthInfo {
  return {
    login: 'justinfan' + Math.floor(Math.random() * 100000),
    password: Math.random().toString(36).slice(2),
  };
}

/**
 * Checks, if password is correct.
 * @param {string} password
 * @returns {boolean}
 */
export function isPasswordValid(password: string): boolean {
  return password.startsWith('oauth:');
}
