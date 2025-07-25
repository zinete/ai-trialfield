import { useDrizzle, tables, eq, and } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { title, tagId, deadline } = await readBody(event);

  const { user }: any = await requireUserSession(event);

  // 验证 tagId 是否属于当前用户
  if (tagId) {
    const tag = await useDrizzle()
      .select({ id: tables.tags.id })
      .from(tables.tags)
      .where(and(eq(tables.tags.id, tagId), eq(tables.tags.userId, user?.id)))
      .get();

    if (!tag) {
      throw createError({
        statusCode: 400,
        statusMessage: "Invalid tag ID",
      });
    }
  }

  const todo = await useDrizzle()
    .insert(tables.todos)
    .values({
      title,
      deadline: new Date(deadline),
      tagId,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user?.id,
    })
    .returning()
    .get();

  // 返回时包含 tag 信息
  if (todo.tagId) {
    const todoWithTag = await useDrizzle()
      .select({
        id: tables.todos.id,
        userId: tables.todos.userId,
        tagId: tables.todos.tagId,
        title: tables.todos.title,
        completed: tables.todos.completed,
        deadline: tables.todos.deadline,
        createdAt: tables.todos.createdAt,
        updatedAt: tables.todos.updatedAt,
        tag: {
          id: tables.tags.id,
          name: tables.tags.name,
          icon: tables.tags.icon,
        },
      })
      .from(tables.todos)
      .leftJoin(tables.tags, eq(tables.todos.tagId, tables.tags.id))
      .where(eq(tables.todos.id, todo.id))
      .get();

    return todoWithTag;
  }

  return todo;
});
