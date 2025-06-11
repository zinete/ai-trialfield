import { tables, useDrizzle } from "../utils/drizzle";

export default defineTask({
  meta: {
    name: "db:seed",
    description: "Run database seed task",
  },
  async run() {
    console.log("Running DB seed task...");
    const todos = [
      {
        title: "做饭",
        createdAt: new Date(),
        updatedAt: new Date(),
        completed: true,
      },
      {
        title: "看电影",
        createdAt: new Date(),
        updatedAt: new Date(),
        completed: false,
      },
    ];
    const sites = [
      {
        title: "baidu",
        url: "https://www.baidu.com",
        icon: "https://www.baidu.com/favicon.ico",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    await useDrizzle().insert(tables.todos).values(todos);
    await useDrizzle().insert(tables.sites).values(sites);
    return { result: "success" };
  },
});
