import path from "node:path";
import { fileURLToPath } from "node:url";

import pg from "pg";

import { loadEnvFile } from "../src/env.js";
import { initLeadDatabase } from "../src/leadStore.js";

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

loadEnvFile(path.join(ROOT_DIR, ".env"));

const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL;

if (!connectionString) {
  console.error("DATABASE_URL is missing. Copy .env.example to .env and add your local PostgreSQL password.");
  process.exit(1);
}

function quoteIdentifier(identifier) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

async function createDatabaseIfMissing(error) {
  if (error.code !== "3D000") {
    throw error;
  }

  const targetUrl = new URL(connectionString);
  const databaseName = targetUrl.pathname.replace(/^\//, "");

  if (!databaseName) {
    throw error;
  }

  targetUrl.pathname = "/postgres";
  const maintenancePool = new Pool({ connectionString: targetUrl.toString() });

  try {
    await maintenancePool.query(`CREATE DATABASE ${quoteIdentifier(databaseName)};`);
    console.log(`Created database: ${databaseName}`);
  } finally {
    await maintenancePool.end();
  }
}

async function setup() {
  let pool = new Pool({ connectionString });

  try {
    await initLeadDatabase(pool);
  } catch (error) {
    await pool.end();
    await createDatabaseIfMissing(error);

    pool = new Pool({ connectionString });
    await initLeadDatabase(pool);
  } finally {
    await pool.end();
  }

  console.log("PostgreSQL is ready. Table: astro_leads");
}

await setup();
