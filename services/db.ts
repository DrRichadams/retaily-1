// services/db.ts
import * as SQLite from "expo-sqlite";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDB() {
  if (!db) {
    db = await SQLite.openDatabaseAsync("retaily_local.db");

    // Initialize the local transactional cache schema
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS cached_transactions (
        id TEXT PRIMARY KEY NOT NULL,
        org_id TEXT NOT NULL,
        amount REAL NOT NULL,
        items_json TEXT NOT NULL,
        customer_id TEXT,
        created_at TEXT NOT NULL,
        synced INTEGER DEFAULT 0
      );
    `);
  }
  return db;
}

export interface LocalTx {
  id: string;
  org_id: string;
  amount: number;
  items_json: string;
  customer_id: string | null;
  created_at: string;
}

// Save a transaction locally immediately
export async function saveTransactionLocally(tx: LocalTx) {
  const database = await getDB();
  await database.runAsync(
    `INSERT INTO cached_transactions (id, org_id, amount, items_json, customer_id, created_at, synced) 
     VALUES (?, ?, ?, ?, ?, ?, 0);`,
    [tx.id, tx.org_id, tx.amount, tx.items_json, tx.customer_id, tx.created_at],
  );
}

// Fetch all unsynced items
export async function getUnsyncedTransactions(): Promise<LocalTx[]> {
  const database = await getDB();
  return await database.getAllAsync<LocalTx>(
    "SELECT id, org_id, amount, items_json, customer_id, created_at FROM cached_transactions WHERE synced = 0;",
  );
}

// Mark items as successfully uploaded
export async function markAsSynced(id: string) {
  const database = await getDB();
  await database.runAsync(
    "UPDATE cached_transactions SET synced = 1 WHERE id = ?;",
    [id],
  );
}

// Count remaining local items to update our POS badge metrics
export async function getUnsyncedCount(): Promise<number> {
  const database = await getDB();
  const result = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM cached_transactions WHERE synced = 0;",
  );
  return result?.count ?? 0;
}
