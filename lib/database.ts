import { SQLiteDatabase } from "expo-sqlite";
import { DATABASE_VERSION } from "./constants";

export type Setting = {
  id: number,
  key: string,
  value: string
};

export type Project = {
  id: number,
  title: string,
  color: string 
};

export type Category = {
  id: number,
  project_id: number,
  title: string,
  color: string
};

export type Task = {
  id: number,
  category_id: number,
  title: string,
  description: string,
  is_until: number,
  until: number,
  important: number,
  finished: number
};

export type Todo = {
  id: number,
  task_id: number,
  title: string,
  done: number
};

async function setDefaultSettings(db: SQLiteDatabase) {
  const defaultSettings = {
    'colorScheme': 'dark' 
  }; 

  await db.runAsync(`
    INSERT OR IGNORE INTO settings (key, value) VALUES(?, ?);
  `, Object.entries(defaultSettings).flat());
}

export async function migrateDbIfNeeded(db: SQLiteDatabase) {
  let data = await db.getFirstAsync<{ user_version: number }>(
    'PRAGMA user_version'
  );

  let currentDbVersion = data ? data.user_version : 0;
  // let currentDbVersion = 0;

  if(currentDbVersion >= DATABASE_VERSION)
    return;

  switch(currentDbVersion) {
    case 0:
      await db.execAsync(`
        CREATE TABLE settings (id INTEGER PRIMARY KEY NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, UNIQUE(key));
        CREATE TABLE projects (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, color TEXT);
        CREATE TABLE categories (id INTEGER PRIMARY KEY NOT NULL, project_id INTEGER NOT NULL, title TEXT NOT NULL, color TEXT, FOREIGN KEY(project_id) REFERENCES projects(id));
        CREATE TABLE tasks (id INTEGER PRIMARY KEY NOT NULL, category_id INTEGER NOT NULL, title TEXT NOT NULL, description TEXT, until INTEGER, important INTEGER DEFAULT 0, finished INTEGER DEFAULT 0, FOREIGN KEY(category_id) REFERENCES categories(id));
        CREATE TABLE todos (id INTEGER PRIMARY KEY NOT NULL, task_id INTEGER NOT NULL, title TEXT NOT NULL, done INTEGER DEFAULT 0);
      `); 

      currentDbVersion = 1;
    break;
  }

  await setDefaultSettings(db);

  await db.execAsync(`PRAGMA user_version = ${DATABASE_VERSION}`);
}