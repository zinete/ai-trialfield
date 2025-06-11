import { useDrizzle, tables } from "~/server/utils/drizzle";

export default eventHandler(async (event) => {
  const { title } = await readBody(event);

  const todo = await useDrizzle()
    .insert(tables.todos)
    .values({
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    .returning()
    .get();

  return todo;
});
