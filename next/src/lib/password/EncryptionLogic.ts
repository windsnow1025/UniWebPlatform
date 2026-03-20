import AES from 'crypto-js/aes';
import enc from 'crypto-js/enc-utf8';
import sha256 from 'crypto-js/sha256';
import hex from 'crypto-js/enc-hex';

export function generateAESKey(key: number): string {
  return sha256(key.toString()).toString(hex);
}

export function encryptAES(plaintext: string, key: number): string {
  if (!plaintext) return '';

  const aesKey = generateAESKey(key);
  return AES.encrypt(plaintext, aesKey).toString();
}

export function decryptAES(ciphertext: string, key: number): string {
  if (!ciphertext) return '';

  const aesKey = generateAESKey(key);
  const bytes = AES.decrypt(ciphertext, aesKey);
  return bytes.toString(enc);
}