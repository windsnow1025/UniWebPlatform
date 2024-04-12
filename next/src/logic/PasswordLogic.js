import sha256 from 'crypto-js/sha256'
import hex from 'crypto-js/enc-hex'

export function generatePassword(key, name, no) {
  const prefix = getPrefix(name);
  const suffix = getSuffix(key, name, no);
  return prefix + "!" + suffix;
}

function getPrefix(siteName) {
  // Find all the letters in the string
  const letters = siteName.match(/[a-zA-Z]/g);

  // If there are no letters, return "Xx"
  if (!letters) {
    return "Xx";
  }

  // If there is only one letter, duplicate it and change the case
  if (letters.length === 1) {
    return letters[0].toUpperCase() + letters[0].toLowerCase();
  }

  // If there are two or more letters, return the first two with the desired case
  return letters[0].toUpperCase() + letters[1].toLowerCase();
}

function getSuffix(key, name, no) {
  const input = name + no + key;
  const hashedPassword = hashSHA256(input);
  const length = 13;
  return hashedPassword.substring(0, length);
}

function hashSHA256(input) {
  const hashedInput = sha256(input);
  return hashedInput.toString(hex);
}
