import crypto from 'crypto';
const encrypt = (text: string, secretKey: Buffer): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  const encrypted = Buffer.concat([
    cipher.update(text),
    cipher.final(),
  ]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
};

export default encrypt;
