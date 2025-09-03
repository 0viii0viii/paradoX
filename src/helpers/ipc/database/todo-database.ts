import Database from "better-sqlite3";
import { app } from "electron";
import path from "path";

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

class TodoDatabase {
  private db: Database.Database | null = null;

  private convertTodoFromDb(dbTodo: any): Todo {
    return {
      id: dbTodo.id,
      text: dbTodo.text,
      completed: Boolean(dbTodo.completed),
      createdAt: dbTodo.createdAt,
      updatedAt: dbTodo.updatedAt,
    };
  }

  private getDbPath(): string {
    const userDataPath = app.getPath("userData");
    return path.join(userDataPath, "todos.db");
  }

  private initializeDatabase(): void {
    if (this.db) return;

    const dbPath = this.getDbPath();
    this.db = new Database(dbPath);

    // Create todos table if it doesn't exist
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);
  }

  public getAllTodos(): Todo[] {
    this.initializeDatabase();
    const stmt = this.db!.prepare(
      "SELECT * FROM todos ORDER BY createdAt DESC",
    );
    const dbTodos = stmt.all() as any[];
    return dbTodos.map((todo) => this.convertTodoFromDb(todo));
  }

  public addTodo(text: string): Todo {
    this.initializeDatabase();
    const now = new Date().toISOString();
    const stmt = this.db!.prepare(`
      INSERT INTO todos (text, completed, createdAt, updatedAt)
      VALUES (?, ?, ?, ?)
    `);

    const result = stmt.run(text, 0, now, now);

    return {
      id: result.lastInsertRowid as number,
      text,
      completed: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  public updateTodo(
    id: number,
    updates: Partial<Pick<Todo, "text" | "completed">>,
  ): Todo | null {
    this.initializeDatabase();

    const existingTodo = this.getTodoById(id);
    if (!existingTodo) return null;

    const updatedAt = new Date().toISOString();
    const text = updates.text !== undefined ? updates.text : existingTodo.text;
    const completed =
      updates.completed !== undefined
        ? updates.completed
        : existingTodo.completed;

    const stmt = this.db!.prepare(`
      UPDATE todos 
      SET text = ?, completed = ?, updatedAt = ?
      WHERE id = ?
    `);

    stmt.run(text, completed ? 1 : 0, updatedAt, id);

    return {
      ...existingTodo,
      text,
      completed,
      updatedAt,
    };
  }

  public deleteTodo(id: number): boolean {
    this.initializeDatabase();
    const stmt = this.db!.prepare("DELETE FROM todos WHERE id = ?");
    const result = stmt.run(id);
    return result.changes > 0;
  }

  public getTodoById(id: number): Todo | null {
    this.initializeDatabase();
    const stmt = this.db!.prepare("SELECT * FROM todos WHERE id = ?");
    const dbTodo = stmt.get(id) as any;
    return dbTodo ? this.convertTodoFromDb(dbTodo) : null;
  }

  public close(): void {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

export const todoDatabase = new TodoDatabase();
