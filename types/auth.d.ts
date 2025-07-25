// 扩展 nuxt-auth-utils 的用户会话类型
declare module '#auth-utils' {
  interface User {
    id: number;
    name: string;
  }

  interface UserSession {
    user: User;
  }
}

export {}
