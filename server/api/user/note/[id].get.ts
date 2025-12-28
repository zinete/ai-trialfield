import { useDrizzle, tables, eq, and, desc } from "~/server/utils/drizzle";

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  const { user } = await requireUserSession(event);

  const note = await useDrizzle()
    .select()
    .from(tables.notes)
    .where(
      and(eq(tables.notes.id, Number(id)), eq(tables.notes.userId, user.id))
    )
    .get();

  return note;
});
