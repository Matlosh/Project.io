import { SQLiteDatabase } from "expo-sqlite";
import { Project } from "~/lib/database";

export const getProject = async (db: SQLiteDatabase, projectId: string): Promise<Project> => {
  const data = await db.getFirstAsync<Project>(`
    SELECT * FROM projects WHERE id = ? 
  `, [projectId]);

  if(data === null) {
    throw new Error(`Could not find matching project.`);
  }

  return data;
};

export const getProjects = async (db: SQLiteDatabase): Promise<Project[]> => {
  return await db.getAllAsync<Project>(`SELECT * FROM projects`);
}

export const insertProject = async (db: SQLiteDatabase, project: any): Promise<number> => {
  const result = await db.runAsync(`
    INSERT INTO projects (title, color) VALUES(?, ?)
  `, [project.title, project.color]); 

  return result.lastInsertRowId;
};

export const updateProject = async (db: SQLiteDatabase, project: any): Promise<number> => {
  const result = await db.runAsync(`
    UPDATE projects SET title = ?, color = ? WHERE id = ?
  `, [project.title, project.color, project.id]); 

  return result.lastInsertRowId;
};