// backend/utils/crypto.js
// Robust encryption helper for AES-256-GCM
// Derives a 32-byte key from an arbitrary passphrase (using SHA-256).
// Usage: const { encrypt, decrypt } = require('./utils/crypto');

const crypto = require("crypto");

const ALGO = "aes-256-gcm";
const IV_LENGTH = 12; // 12 bytes recommended for GCM

// Derive a 32-byte key from any passphrase using SHA-256
function deriveKey(passphrase) {
  if (!passphrase || typeof passphrase !== "string") {
    throw new Error("Passphrase must be a non-empty string");
  }
  // returns a Buffer of length 32
  return crypto.createHash("sha256").update(passphrase, "utf8").digest();
}

function encrypt(obj, passphrase) {
  const key = deriveKey(passphrase);
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGO, key, iv);
  const plaintext = JSON.stringify(obj);
  let encrypted = cipher.update(plaintext, "utf8", "base64");
  encrypted += cipher.final("base64");
  const tag = cipher.getAuthTag(); // Buffer
  // Return a single string that contains iv:tag:encrypted (all base64)
  return `${iv.toString("base64")}:${tag.toString("base64")}:${encrypted}`;
}

function decrypt(encString, passphrase) {
  const key = deriveKey(passphrase);
  const parts = encString.split(":");
  if (parts.length !== 3) throw new Error("Invalid encrypted data format");
  const iv = Buffer.from(parts[0], "base64");
  const tag = Buffer.from(parts[1], "base64");
  const encrypted = parts[2];
  const decipher = crypto.createDecipheriv(ALGO, key, iv);
  decipher.setAuthTag(tag);
  let dec = decipher.update(encrypted, "base64", "utf8");
  dec += decipher.final("utf8");
  return JSON.parse(dec);
}

module.exports = { encrypt, decrypt, deriveKey };
