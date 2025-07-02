// import { withAuth } from "~/server/utils/auth";
import { useDrizzle, tables } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { title, tags } = await readBody(event);

  const { user }: any = await requireUserSession(event);
  const todo = await useDrizzle()
    .insert(tables.todos)
    .values({
      title,
      tags,
      createdAt: new Date(),
      updatedAt: new Date(),
      userId: user?.id,
    })
    .returning()
    .get();

  return todo;
});
