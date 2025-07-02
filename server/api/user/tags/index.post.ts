/**
 * @ Author: ZhengHui
 * @ Create Time: 2025-06-30 16:42:00
 * @ Modified by: ZhengHui
 * @ Modified time: 2025-06-30 17:04:14
 * @ Description:
 */

import { useDrizzle, tables } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { name, icon } = await readBody(event);

  const { user }: any = await requireUserSession(event);
  const tag = await useDrizzle()
    .insert(tables.tags)
    .values({
      name,
      icon,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user?.id,
    })
    .returning()
    .get();

  return tag;
});
