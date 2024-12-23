import * as Crypto from 'expo-crypto';

export const generateUserId = () => {
  // Generate 16 random bytes
  const randomBytes = Crypto.getRandomBytes(16);

  // Convert the random bytes to a hexadecimal string
  const userId = Array.from(randomBytes)
    .map((byte) => byte.toString(16).padStart(2, '0')) // Convert byte to hex
    .join(''); // Join all bytes into a single string

  console.log('Generated User ID:', userId);
  return userId;
};
