// Shared helpers: Firebase Admin init, CORS, JSON responses, admin auth
let admin;

function getAdmin() {
  if (admin) return admin;
  admin = require("firebase-admin");

  const saRaw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!saRaw) throw new Error("FIREBASE_SERVICE_ACCOUNT is missing");

  const sa = JSON.parse(saRaw);
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(sa),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  }
  return admin;
}

function corsify(res) {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Content-Type": "application/json",
  };
  return { ...res, headers: { ...(res.headers || {}), ...headers } };
}

const ok   = (body) => corsify({ statusCode: 200, body: JSON.stringify(body) });
const bad  = (body) => corsify({ statusCode: 400, body: JSON.stringify(body) });
const deny = (body) => corsify({ statusCode: 403, body: JSON.stringify(body) });
const err  = (e)    => corsify({ statusCode: 500, body: JSON.stringify({ error: e.message || String(e) }) });

function requireHost(event) {
  const auth = event.headers?.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : auth;
  return token && token === process.env.ADMIN_SIGNING_SECRET;
}

module.exports = { getAdmin, ok, bad, deny, err, requireHost };

