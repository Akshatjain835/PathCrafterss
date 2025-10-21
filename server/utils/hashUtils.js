import bcrypt from "bcryptjs";

// Hash password before saving to DB
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

// Compare entered password with hashed one
export const comparePassword = async (enteredPassword, hashedPassword) => {
  return await bcrypt.compare(enteredPassword, hashedPassword);
};
