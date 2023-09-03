import { config } from 'dotenv';

config();

async function getDataBaseUrl() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    throw new Error('DATABASE_URL must be set');
  }

  return DATABASE_URL;
}

const DATABASE_URL = getDataBaseUrl();
async function getJWTSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error('JWT_SECRET must be set');
  }

  return JWT_SECRET;
}

async function getEncryptionKey() {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY must be set');
  }

  return ENCRYPTION_KEY;
}

const ENCRYPTION_KEY = getEncryptionKey();
const JWT_SECRET = getJWTSecret();

async function getGoogleClientId() {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_ID;

  if (!GOOGLE_CLIENT_ID) {
    throw new Error('GOOGLE_CLIENT_ID must be set');
  }

  return GOOGLE_CLIENT_ID;
}

const GOOGLE_CLIENT_ID = getGoogleClientId();

export { DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID, ENCRYPTION_KEY };
