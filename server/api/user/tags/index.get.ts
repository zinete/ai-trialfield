/**
 * @ Author: ZhengHui
 * @ Create Time: 2025-06-30 16:36:44
 * @ Modified by: ZhengHui
 * @ Modified time: 2025-06-30 17:33:18
 * @ Description:
 */

import { useDrizzle, tables } from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
  const { user }: any = await requireUserSession(event);
  const tags = await useDrizzle()
    .select()
    .from(tables.tags)
    .where(and(eq(tables.tags.userId, user?.id)))
    .all();

  return tags;
});
