import crypto from 'crypto';
const decrypt = (
  encryptedText: string,
  secretKey: Buffer
): string => {
  const [iv, encrypted] = encryptedText
    .split(':')
    .map((part) => Buffer.from(part, 'hex'));
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    secretKey,
    iv
  );
  return Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]).toString();
};
export default decrypt;
