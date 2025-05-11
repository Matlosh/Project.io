import { SQLiteDatabase } from "expo-sqlite";
import { Project } from "~/lib/database";

export const fetchProjects = async (db: SQLiteDatabase): Promise<Project[]> => {
  return await db.getAllAsync<Project>(`SELECT * FROM projects`);
}