import bcrypt from 'bcrypt'

// Hash the password during user registration
export const hash = async (password: string): Promise<{hash: string, salt: string}> => {
  return new Promise((resolve, reject) => {
  const saltRounds = parseInt(process.env.SALT_ROUNDS ?? "10"); // Number of salt rounds, higher is more secure but slower
  bcrypt.genSalt(saltRounds, (err, salt) => {
    if (err) reject(err);
    bcrypt.hash(password, salt, (err, hash) => {
      if (err) reject(err);
      resolve({ hash, salt })
    });
  });
});
}

export const compare = async (password: string, storedHash: string, storedSalt: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, storedHash, (err, result) => {
      if (err) reject(err);
      if (result) {
        return true;
      } else {
        throw new Error('Passwords do not match');
      }
    });
  }); 
}