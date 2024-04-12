import {generatePassword} from "./PasswordLogic";

describe('generatePassword', () => {
  it('should generate a password', () => {
    const password = generatePassword(0, "test", 0);
    expect(password).toStrictEqual("Te!12ef4ded7a464");
  });
});