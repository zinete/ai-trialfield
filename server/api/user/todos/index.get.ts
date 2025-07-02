import { useError } from "nuxt/app";
import { useDrizzle, tables } from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
  const { user }: any = await requireUserSession(event);
  const todos = await useDrizzle()
    .select()
    .from(tables.todos)
    .where(and(eq(tables.todos.userId, user?.id)))
    .all();

  return todos;
});
