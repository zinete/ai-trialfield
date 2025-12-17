import { useDrizzle, tables, eq, and } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { title, deadline, content } = await readBody(event);

  const { user }: any = await requireUserSession(event);

  const note = await useDrizzle()
    .insert(tables.notes)
    .values({
      title,
      content,
      deadline: new Date(deadline),
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user?.id,
    })
    .returning()
    .get();

  return note;
});
