/**
 * @ Author: ZhengHui
 * @ Create Time: 2025-04-01 13:31:44
 * @ Modified by: ZhengHui
 * @ Modified time: 2025-05-28 17:51:47
 * @ Description:
 */

export default defineEventHandler(async (event) => {
  const { history } = await readBody(event);
  try {
    const messages = [
      {
        role: "system",
        content: `你是一个专业的健康顾问，你的任务是为用户提供个性化的健康建议。每次回答问题结尾，都需要带上 元宝AI😘随时为你提供服务 。`,
      },
      ...history,
    ];
    const ai = hubAI();
    const stream = await ai.run("@cf/qwen/qwen1.5-7b-chat-awq", {
      stream: true,
      messages,
    });

    return stream;
  } catch (error: any) {
    console.error("API调用错误:", error.message);
    return {
      code: error.response?.status || 500,
      data: null,
      message: error.message || "服务器错误",
    };
  }
});
