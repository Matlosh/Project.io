import { SQLiteDatabase } from "expo-sqlite";
import { Task } from "~/lib/database";

export const getTask = async (db: SQLiteDatabase, taskId: string): Promise<Task> => {
  const data = await db.getFirstAsync<Task>(`
    SELECT * FROM tasks WHERE id = ?
  `, taskId);

  if(data === null) {
    throw new Error(`Could not find matching task.`);
  }

  return data;
};

export const getTasks = async (db: SQLiteDatabase, categoryId: string): Promise<Task[]> => {
  return await db.getAllAsync<Task>(`
    SELECT * FROM tasks WHERE category_id = ? ORDER BY finished DESC
  `, categoryId);
};

export const insertTask = async (db: SQLiteDatabase, task: any): Promise<number> => {
  const result = await db.runAsync(`
    INSERT INTO tasks (category_id, title, description, is_until, until, important) VALUES(?, ?, ?, ?, ?, ?)
  `, [
    task.categoryId,
    task.title,
    task.description,
    task.showUntil,
    Math.floor(task.until.getTime() / 1000),
    task.important
  ]); 

  return result.lastInsertRowId;
};

export const updateTask = async (db: SQLiteDatabase, task: any): Promise<number> => {
  const result = await db.runAsync(`
    UPDATE tasks SET title = ?, description = ?, is_until = ?, until = ?, important = ? WHERE id = ?
  `, [
    task.title,
    task.description,
    task.showUntil,
    Math.floor(task.until.getTime() / 1000),
    task.important,
    task.id
  ]); 

  return result.lastInsertRowId;
};