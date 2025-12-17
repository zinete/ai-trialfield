/**
 * @ Author: ZhengHui
 * @ Create Time: 2025-06-10 17:59:28
 * @ Modified by: ZhengHui
 * @ Modified time: 2025-10-16 16:16:44
 * @ Description:
 */

export default eventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const { completed } = await readBody(event);
  const { user }: any = await requireUserSession(event);
  const todo = await useDrizzle()
    .select()
    .from(tables.notes)
    .where(eq(tables.notes.id, Number(id)))
    .get();

  if (!todo) {
    throw createError({ statusCode: 404, message: "数据不存在" });
  }
  if (todo.userId !== user.id) {
    throw createError({
      statusCode: 403,
      message: "无权操作他人的数据",
    });
  }
  const updated = await useDrizzle()
    .update(tables.notes)
    .set({ completed, updatedAt: new Date() })
    .where(eq(tables.notes.id, Number(id)))
    .returning()
    .get();

  return updated;
});
