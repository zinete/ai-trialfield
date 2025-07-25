import { useDrizzle, tables, eq, and, desc } from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
  const { user }: any = await requireUserSession(event);
  const query = getQuery(event);
  const tagFilter = query.tag as string;

  // 构建查询条件
  let whereConditions = [eq(tables.todos.userId, user?.id)];

  // 如果有 tag 过滤条件，添加到查询中
  if (tagFilter && tagFilter !== "all") {
    // 首先根据 tag 名称查找 tagId
    const tag = await useDrizzle()
      .select({ id: tables.tags.id })
      .from(tables.tags)
      .where(
        and(eq(tables.tags.name, tagFilter), eq(tables.tags.userId, user?.id))
      )
      .get();

    if (tag) {
      whereConditions.push(eq(tables.todos.tagId, tag.id));
    } else {
      // 如果找不到对应的 tag，返回空数组
      return [];
    }
  }

  // 查询 todos 并关联 tags 信息
  const todos = await useDrizzle()
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
    .where(and(...whereConditions))
    .orderBy(desc(tables.todos.createdAt))
    .all();

  return todos;
});
