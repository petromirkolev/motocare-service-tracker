import { db } from './db';

export async function runQuery(
  sql: string,
  params: unknown[] = [],
): Promise<void> {
  await db.query(sql, params);
}

export async function getOne<T>(
  sql: string,
  params: unknown[] = [],
): Promise<T | undefined> {
  const result = await db.query(sql, params);
  return result.rows[0] as T | undefined;
}

export async function getAll<T>(
  sql: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await db.query(sql, params);
  return result.rows as T[];
}
