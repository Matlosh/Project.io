import { SQLiteDatabase } from "expo-sqlite";
import { ExtendedCategory } from "~/app/(tabs)/projects/[projectId]";
import { Category } from "~/lib/database";

export const getCategory = async (db: SQLiteDatabase, categoryId: string): Promise<Category> => {
  const data = await db.getFirstAsync<Category>(`
    SELECT * FROM categories WHERE id = ?
  `, categoryId);

  if(data === null) {
    throw new Error(`Could not find matching category.`);
  }

  return data;
};

export const getExtendedCategories = async (db: SQLiteDatabase, projectId: string): Promise<ExtendedCategory[]> => {
  return await db.getAllAsync<ExtendedCategory>(`
    SELECT categories.*, (SELECT COUNT(id) FROM tasks WHERE finished = 0 AND category_id = categories.id) AS active_tasks_count FROM categories WHERE project_id = ? 
  `, [projectId]); 
};

export const insertCategory = async (db: SQLiteDatabase, category: any): Promise<number> => {
  const result = await db.runAsync(`
    INSERT INTO categories (project_id, title, color) VALUES(?, ?, ?)
  `, [category.projectId, category.title, category.color]); 

  return result.lastInsertRowId;
};

export const updateCategory = async (db: SQLiteDatabase, category: any): Promise<number> => {
  const result = await db.runAsync(`
    UPDATE categories SET title = ?, color = ? WHERE id = ?
  `, [category.title, category.color, category.id]); 

  return result.lastInsertRowId;
};

export const deleteCategory = async (db: SQLiteDatabase, categoryId: string): Promise<void> => {
  await db.runAsync(`
    DELETE FROM categories WHERE id = ?
  `, [categoryId]);
};