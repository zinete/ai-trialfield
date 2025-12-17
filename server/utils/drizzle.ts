import { drizzle } from "drizzle-orm/d1";
export { sql, eq, and, or, desc } from "drizzle-orm";

import * as schema from "../database/schema";

export const tables = schema;

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema });
}

// 重新导出类型以保持兼容性
export type Notes = typeof schema.notes.$inferSelect;
export type Sites = typeof schema.sites.$inferSelect;
export type Users = typeof schema.users.$inferSelect;
