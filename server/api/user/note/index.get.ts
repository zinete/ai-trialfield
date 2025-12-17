import { useDrizzle, tables, eq, and, desc } from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
  const { user }: any = await requireUserSession(event);

  // 构建查询条件
  let whereConditions = [eq(tables.notes.userId, user?.id)];

  const notes = await useDrizzle()
    .select({
      id: tables.notes.id,
      userId: tables?.notes?.userId,
      content: tables.notes.content,
      title: tables.notes.title,
      completed: tables.notes.completed,
      deadline: tables.notes.deadline,
      createdAt: tables.notes.createdAt,
      updatedAt: tables.notes.updatedAt,
    })
    .from(tables.notes)

    .where(and(...whereConditions))
    .orderBy(desc(tables.notes.createdAt))
    .all();

  return notes;
});
