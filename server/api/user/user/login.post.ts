/**
 * @ Author: ZhengHui
 * @ Create Time: 2025-06-27 10:33:30
 * @ Modified by: ZhengHui
 * @ Modified time: 2025-06-30 16:41:29
 * @ Description: 登录
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
  const user = await db
    .select()
    .from(tables.users)
    .where(eq(tables.users.username, username));
  if (user.length === 0 || user[0].password !== password) {
    throw createError({
      statusCode: 401,
      message: "用户名或密码错误",
    });
  }
  await setUserSession(
    event,
    {
      user: {
        id: user[0].id,
        name: user[0].username,
      },
    },
    {
      maxAge: 86400,
    }
  );
  return {
    code: 200,
    message: "登录成功",
  };
});
