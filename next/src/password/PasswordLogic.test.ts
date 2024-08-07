import {generatePassword} from "./PasswordLogic";
import {describe, expect, it} from "@jest/globals";

describe('generatePassword', () => {
  it('should generate a password', () => {
    const password = generatePassword(0, "test", 0, 16);
    expect(password).toStrictEqual("Te!12ef4ded7a464");
  });
});