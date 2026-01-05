/**
 * db.setup.js
 * Professional DB bootstrap for PostgreSQL:
 * - tests connection
 * - creates tables (idempotent)
 * - creates indexes
 * - runs in a single transaction
 *
 * Run:
 *   node db.setup.js
 */

import "dotenv/config";
import pg from "pg";

const { Pool } = pg;

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("❌ Missing DATABASE_URL in .env");
  process.exit(1);
}

const pool = new Pool({
  connectionString: DATABASE_URL,
  // ssl: { rejectUnauthorized: false }, // enable if using hosted DB w/ SSL
});

async function run() {
  const client = await pool.connect();

  try {
    console.log("🔌 Testing DB connection...");
    const ping = await client.query("SELECT NOW() AS now;");
    console.log("✅ Connected. Server time:", ping.rows[0].now);

    console.log("🧱 Creating schema (transaction)...");
    await client.query("BEGIN;");

    // Enable UUID generation (Postgres)
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `);

    // =========================
    // USERS
    // =========================
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(150),
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        avatar_url TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // =========================
    // MAIL ACCOUNTS (connected inboxes)
    // =========================
    await client.query(`
      CREATE TABLE IF NOT EXISTS mail_accounts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        provider VARCHAR(30) NOT NULL,          -- gmail, outlook, imap...
        email_address VARCHAR(255) NOT NULL,
        access_token TEXT,
        refresh_token TEXT,
        last_synced_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT uq_mail_accounts_user_provider_email UNIQUE (user_id, provider, email_address)
      );
    `);

    // =========================
    // EMAIL THREADS
    // =========================
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_threads (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        mail_account_id UUID NOT NULL REFERENCES mail_accounts(id) ON DELETE CASCADE,
        thread_key VARCHAR(255) NOT NULL,       -- provider thread id
        last_message_at TIMESTAMPTZ,

        CONSTRAINT uq_threads_account_thread UNIQUE (mail_account_id, thread_key)
      );
    `);

    // =========================
    // EMAILS
    // =========================
    await client.query(`
      CREATE TABLE IF NOT EXISTS emails (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        mail_account_id UUID NOT NULL REFERENCES mail_accounts(id) ON DELETE CASCADE,
        thread_id UUID REFERENCES email_threads(id) ON DELETE SET NULL,

        message_id VARCHAR(255) NOT NULL,       -- provider message id
        from_address VARCHAR(255) NOT NULL,
        to_address VARCHAR(255),
        subject TEXT,
        body_text TEXT,
        body_html TEXT,
        received_at TIMESTAMPTZ NOT NULL,

        is_read BOOLEAN NOT NULL DEFAULT FALSE,
        is_archived BOOLEAN NOT NULL DEFAULT FALSE,
        is_starred BOOLEAN NOT NULL DEFAULT FALSE,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT uq_emails_account_message UNIQUE (mail_account_id, message_id)
      );
    `);

    // =========================
    // ATTACHMENTS
    // =========================
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_attachments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email_id UUID NOT NULL REFERENCES emails(id) ON DELETE CASCADE,

        file_name TEXT NOT NULL,
        file_type VARCHAR(100),
        file_size BIGINT,
        file_url TEXT,

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // =========================
    // AI ACTIONS
    // =========================
    await client.query(`
      CREATE TABLE IF NOT EXISTS ai_actions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email_id UUID NOT NULL REFERENCES emails(id) ON DELETE CASCADE,

        action_type VARCHAR(30) NOT NULL,       -- summary, reply, classify, rewrite
        prompt_used TEXT,
        ai_response TEXT,
        model_used VARCHAR(80),

        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // =========================
    // LABELS + MAP
    // =========================
    await client.query(`
      CREATE TABLE IF NOT EXISTS email_labels (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(80) NOT NULL UNIQUE,
        color VARCHAR(30),
        is_ai_generated BOOLEAN NOT NULL DEFAULT FALSE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await client.query(`
      CREATE TABLE IF NOT EXISTS email_label_map (
        email_id UUID NOT NULL REFERENCES emails(id) ON DELETE CASCADE,
        label_id UUID NOT NULL REFERENCES email_labels(id) ON DELETE CASCADE,

        PRIMARY KEY (email_id, label_id)
      );
    `);

    // =========================
    // USER SETTINGS (1 row per user)
    // =========================
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_settings (
        user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,

        theme VARCHAR(20) NOT NULL DEFAULT 'system',      -- light/dark/system
        language VARCHAR(10) NOT NULL DEFAULT 'en',
        auto_ai_enabled BOOLEAN NOT NULL DEFAULT FALSE,
        notification_enabled BOOLEAN NOT NULL DEFAULT TRUE,

        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // =========================
    // SESSIONS (optional)
    // =========================
    await client.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // =========================
    // SYNC LOGS (optional)
    // =========================
    await client.query(`
      CREATE TABLE IF NOT EXISTS sync_logs (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        mail_account_id UUID NOT NULL REFERENCES mail_accounts(id) ON DELETE CASCADE,

        status VARCHAR(20) NOT NULL,    -- ok, warn, error
        message TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // =========================
    // INDEXES (performance)
    // =========================
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_emails_account_received
      ON emails (mail_account_id, received_at DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_emails_thread
      ON emails (thread_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_ai_actions_email_created
      ON ai_actions (email_id, created_at DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_attachments_email
      ON email_attachments (email_id);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sessions_user_expires
      ON sessions (user_id, expires_at DESC);
    `);

    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_sync_logs_account_created
      ON sync_logs (mail_account_id, created_at DESC);
    `);

    await client.query("COMMIT;");
    console.log("✅ All tables + indexes created successfully.");
  } catch (err) {
    await client.query("ROLLBACK;");
    console.error("❌ Failed. Rolled back changes.\n", err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

run();
