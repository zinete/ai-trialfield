/**
 * @ Author: ZhengHui
 * @ Create Time: 2025-06-30 16:36:44
 * @ Modified by: ZhengHui
 * @ Modified time: 2025-10-16 16:38:07
 * @ Description:
 */

import { useDrizzle, tables } from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
  const { user }: any = await requireUserSession(event);
  const tags = await useDrizzle()
    .select()
    .from(tables.notes)
    .where(and(eq(tables.notes.userId, user?.id)))
    .orderBy(desc(tables.notes.createdAt))
    .all();

  return tags;
});
