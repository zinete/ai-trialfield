import { useDrizzle, tables } from "~/server/utils/drizzle";

export default eventHandler(async () => {
  const todos = await useDrizzle().select().from(tables.todos).all();

  return todos;
});
