/**
 * @ Author: ZhengHui
 * @ Create Time: 2025-06-27 10:56:25
 * @ Modified by: ZhengHui
 * @ Modified time: 2025-06-27 14:27:49
 * @ Description:
 */

import { useDrizzle, eq, tables } from "../../../utils/drizzle";

export default defineEventHandler(async (event) => {
  const { username, password } = await readBody(event);
  const db = useDrizzle();
  if (!username || !password) {
    throw createError({
      statusCode: 400,
      message: "用户名和密码不能为空",
    });
  }
  // 检查用户名是否已存在
  const exists = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.username, username));
  if (exists.length > 0) {
    throw createError({
      statusCode: 409,
      message: "用户名已存在",
    });
  }
  // 插入新用户
  await db.insert(tables.users).values({ username, password });
  // drizzle-orm sqlite 返回 last inserted row id 需单独查询
  const user = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.username, username));
  if (user.length === 0) {
    throw createError({
      statusCode: 500,
      message: "注册失败",
    });
  }
  return {
    code: 200,
    message: "注册成功",
  };
});
