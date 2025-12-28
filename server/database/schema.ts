/**
 * @ Author: ZhengHui
 * @ Create Time: 2025-06-10 17:18:01
 * @ Modified by: ZhengHui
 * @ Modified time: 2025-10-16 15:52:40
 * @ Description:
 */

import { json } from "drizzle-orm/gel-core";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const notes = sqliteTable("note", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId", {
    mode: "number",
  }),
  title: text("title").notNull(),
  content: text("content"),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  deadline: integer("deadline", { mode: "timestamp" }),
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

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(new Date()),
});
