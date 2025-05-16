import { SQLiteDatabase } from "expo-sqlite";
import { Todo } from "~/lib/database";

export async function getTodos(db: SQLiteDatabase, taskId: string): Promise<Todo[]> {
  return await db.getAllAsync<Todo>(`
    SELECT * FROM todos WHERE task_id = ? 
  `, taskId);
};

export async function insertTodo(db: SQLiteDatabase, todo: any): Promise<number> {
  const result = await db.runAsync(`
    INSERT INTO todos (task_id, title, done) VALUES(?, ?, ?)
  `, [
    todo.taskId,
    todo.title,
    todo.done
  ]); 

  return result.lastInsertRowId;
};

export async function updateTodo(db: SQLiteDatabase, todo: any): Promise<number> {
  const result = await db.runAsync(`
    UPDATE todos SET title = ?, done = ? WHERE id = ?
  `, [
    todo.title,
    todo.done,
    todo.id
  ]); 

  return result.lastInsertRowId;
};

export async function deleteTodo(db: SQLiteDatabase, todoId: string): Promise<void> {
  await db.runAsync(`
    DELETE FROM todos WHERE id = ?
  `, todoId);
};