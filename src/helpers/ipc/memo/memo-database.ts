import Database from "better-sqlite3";
import { app } from "electron";
import path from "path";

export type Memo = {
  id: number;
  title: string;
  isEncrypted: boolean;
  password: string;
  lines: Line[];
  createdAt: string;
  updatedAt: string;
};

export type Line = {
  id: number;
  text: string;
  createdAt: string;
  updatedAt: string;
};

// 데이터베이스에서 반환되는 원시 데이터 타입
type DbMemo = {
  id: number;
  title: string;
  isEncrypted: number; // SQLite에서는 boolean이 0/1로 저장됨
  password: string;
  lines: string; // JSON 문자열로 저장됨
  createdAt: string;
  updatedAt: string;
};

class MemoDatabase {
  private db: Database.Database | null = null;

  private convertMemoFromDb(dbMemo: DbMemo): Memo {
    return {
      id: dbMemo.id,
      title: dbMemo.title,
      isEncrypted: Boolean(dbMemo.isEncrypted),
      password: dbMemo.password,
      lines: JSON.parse(dbMemo.lines) as Line[],
      createdAt: dbMemo.createdAt,
      updatedAt: dbMemo.updatedAt,
    };
  }

  private getDbPath(): string {
    const userDataPath = app.getPath("userData");
    return path.join(userDataPath, "memos.db");
  }

  private initializeDatabase(): void {
    if (this.db) return;

    const dbPath = this.getDbPath();
    this.db = new Database(dbPath);

    // Create memos table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS memos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        isEncrypted BOOLEAN NOT NULL DEFAULT 0,
        password TEXT NOT NULL DEFAULT '',
        lines TEXT NOT NULL DEFAULT '[]',
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
  }

  public getAllMemos(): Memo[] {
    this.initializeDatabase();
    const stmt = this.db!.prepare(
      "SELECT * FROM memos ORDER BY createdAt DESC",
    );
    const dbMemos = stmt.all() as DbMemo[];
    return dbMemos.map((memo) => this.convertMemoFromDb(memo));
  }

  public addMemo(memo: Omit<Memo, "id" | "createdAt" | "updatedAt">): Memo {
    this.initializeDatabase();
    const now = new Date().toISOString();
    const stmt = this.db!.prepare(
      "INSERT INTO memos (title, isEncrypted, password, lines, createdAt, updatedAt) VALUES (?, ?, ?, ?, ?, ?)",
    );
    const result = stmt.run(
      memo.title,
      memo.isEncrypted ? 1 : 0,
      memo.password,
      JSON.stringify(memo.lines),
      now,
      now,
    );

    const newMemo: Memo = {
      id: result.lastInsertRowid as number,
      title: memo.title,
      isEncrypted: memo.isEncrypted,
      password: memo.password,
      lines: memo.lines,
      createdAt: now,
      updatedAt: now,
    };

    return newMemo;
  }

  public updateMemo(
    id: number,
    updates: Partial<Omit<Memo, "id" | "createdAt" | "updatedAt">>,
  ): Memo | null {
    this.initializeDatabase();

    const existingMemo = this.getMemoById(id);
    if (!existingMemo) return null;

    const now = new Date().toISOString();
    const stmt = this.db!.prepare(
      "UPDATE memos SET title = ?, isEncrypted = ?, password = ?, lines = ?, updatedAt = ? WHERE id = ?",
    );

    const updatedMemo: Memo = {
      ...existingMemo,
      ...updates,
      id,
      updatedAt: now,
    };

    stmt.run(
      updatedMemo.title,
      updatedMemo.isEncrypted ? 1 : 0,
      updatedMemo.password,
      JSON.stringify(updatedMemo.lines),
      now,
      id,
    );

    return updatedMemo;
  }

  public deleteMemo(id: number): boolean {
    this.initializeDatabase();
    const stmt = this.db!.prepare("DELETE FROM memos WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }

  public getMemoById(id: number): Memo | null {
    this.initializeDatabase();
    const stmt = this.db!.prepare("SELECT * FROM memos WHERE id = ?");
    const dbMemo = stmt.get(id) as DbMemo | undefined;
    return dbMemo ? this.convertMemoFromDb(dbMemo) : null;
  }

  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export const memoDatabase = new MemoDatabase();
