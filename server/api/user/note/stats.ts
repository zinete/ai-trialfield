import { count } from "drizzle-orm";
import { useDrizzle, tables, eq, and } from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
  const { user }: any = await requireUserSession(event);
  const db = useDrizzle();

  // 获取总数
  const [totalResult, completedResult] = await Promise.all([
    // 查询总任务数
    db
      .select({ count: count() })
      .from(tables.notes)
      .where(eq(tables.notes.userId, user?.id))
      .get(),

    // 查询已完成任务数
    db
      .select({ count: count() })
      .from(tables.notes)
      .where(
        and(eq(tables.notes.userId, user?.id), eq(tables.notes.completed, true))
      )
      .get(),
  ]);

  const total = totalResult?.count ?? 0;
  const completed = completedResult?.count ?? 0;

  return {
    total,
    completed,
    remaining: total - completed,
  };
});
