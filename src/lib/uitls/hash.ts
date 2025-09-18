import bcrypt from "bcrypt";

const SALT_ROUNDS = Number(process.env.SALT);

export const hashPassword = async (pw: string): Promise<string> => {
  return bcrypt.hash(pw, SALT_ROUNDS);
};

export const verifyPassword = async (
  pw: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(pw, hash);
};

export const genCode = (length = 6): string => {
  return Math.random()
    .toString()
    .slice(2, 2 + length);
};
