import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

config();

async function getDataBaseUrl() {
  const DATABASE_URL = process.env.DATABASE_URL;

  if (!DATABASE_URL) {
    throw new Error("DATABASE_URL must be set");
  }

  return DATABASE_URL;
}

const DATABASE_URL = getDataBaseUrl();
async function getJWTSecret() {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET must be set");
  }

  return JWT_SECRET;
}

async function getStripeSecretKey() {
  const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

  if (!STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY must be set");
  }

  return STRIPE_SECRET_KEY;
}

async function getEncryptionKey() {
  const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

  if (!ENCRYPTION_KEY) {
    throw new Error("ENCRYPTION_KEY must be set");
  }

  return ENCRYPTION_KEY;
}

async function getAIKey() {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    throw new Error("STRIPE_PUBLIC_KEY must be set");
  }

  return OPENAI_API_KEY;
}

const OPEN_AI_KEY = getAIKey();

const ENCRYPTION_KEY = getEncryptionKey();
const JWT_SECRET = getJWTSecret();
const STRIPE_SECRET_KEY = getStripeSecretKey();

async function getGoogleClientId() {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_OAUTH_ID;

  if (!GOOGLE_CLIENT_ID) {
    throw new Error("GOOGLE_CLIENT_ID must be set");
  }

  return GOOGLE_CLIENT_ID;
}

const GOOGLE_CLIENT_ID = getGoogleClientId();

async function getSuperBaseSecret() {
  const SUPERBASE_SECRET = process.env.SUPERBASE_ANON_KEY;

  if (!SUPERBASE_SECRET) {
    throw new Error("SUPERBASE_SECRET must be set");
  }

  return SUPERBASE_SECRET;
}

const SUPERBASE_SECRET = getSuperBaseSecret();

async function initiateSuperbase() {
  const supabaseUrl = "https://wosbhxghmxqqwsrejrnl.supabase.co";

  const supabaseKey = await SUPERBASE_SECRET;

  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });

  return supabase;
}

const START_SUPABASE = initiateSuperbase();

async function getDeepgramKey() {
  const deepgramKey = process.env.DEEPGRAM_API_KEY;

  if (!deepgramKey) {
    throw new Error("No Deepgram API key found");
  }

  return deepgramKey;
}

const DEEPGRAM_API_KEY = getDeepgramKey();

export {
  DATABASE_URL,
  JWT_SECRET,
  GOOGLE_CLIENT_ID,
  ENCRYPTION_KEY,
  STRIPE_SECRET_KEY,
  OPEN_AI_KEY,
  SUPERBASE_SECRET,
  START_SUPABASE,
  DEEPGRAM_API_KEY,
};
