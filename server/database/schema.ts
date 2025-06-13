/**
 * @ Author: ZhengHui
 * @ Create Time: 2025-06-10 17:18:01
 * @ Modified by: ZhengHui
 * @ Modified time: 2025-06-13 15:23:13
 * @ Description:
 */

import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const todos = sqliteTable("todos", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
});

export const sites = sqliteTable("sites", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("title").notNull(),
  url: text("url").notNull(),
  favicon: text("favicon").notNull(),
  status: text("status").notNull(),
  //
  desc: text("desc"),
  sort: integer("sort"),
  lastCheck: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
});

//  id: 1,
// name: "GitHub",
// url: "https://github.com",
// favicon: "https://github.com/favicon.ico",
// status: "active",
// lastCheck: new Date(),
