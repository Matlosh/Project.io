import { SQLiteDatabase } from "expo-sqlite";
import { Todo } from "~/lib/database";

export type TodosInfo = {
  available: number,
  completed: number
};

export async function getTodos(db: SQLiteDatabase, taskId: string): Promise<Todo[]> {
  return await db.getAllAsync<Todo>(`
    SELECT * FROM todos WHERE task_id = ? 
  `, taskId);
};

export async function getTodosInfo(db: SQLiteDatabase, taskId: string): Promise<TodosInfo> {
  const data = await db.getFirstAsync<TodosInfo>(`
    SELECT
    (
      SELECT COUNT(id) FROM todos WHERE task_id = ?
    ) AS available,
    (
      SELECT COUNT(id) FROM todos WHERE task_id = ? AND done = 1
    ) AS completed; 
  `, [taskId, taskId]); 

  if(data === null) {
    throw new Error("Could not fetch task's todos info.");
  }

  return data;
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

// Sets the task as finished if all todos are done
export async function markTodoStatus(db: SQLiteDatabase, data: any): Promise<void> {
  await db.withTransactionAsync(async () => {
    await db.runAsync(`
      UPDATE todos SET done = ? WHERE id = ?;
    `, [+data.checked, data.id]);

    await db.runAsync(`
      UPDATE tasks SET finished =
        ((SELECT COUNT(id) FROM todos WHERE done = 0 AND task_id = ?) = 0)
        WHERE id = ?;
    `, [data.taskId, data.taskId]);
  });
}