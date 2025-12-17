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
        userId: null,
        tag: null,
      },
      {
        title: "看电影",
        createdAt: new Date(),
        updatedAt: new Date(),
        completed: false,
        userId: null,
        tag: null,
      },
    ];
    const sites = [
      {
        name: "baidu",
        url: "https://www.baidu.com",
        favicon: "https://www.baidu.com/favicon.ico",
        createdAt: new Date(),
        updatedAt: new Date(),
        status: "active",
      },
    ];
    await useDrizzle().insert(tables.notes).values(todos);
    await useDrizzle().insert(tables.sites).values(sites);
    return { result: "success" };
  },
});
