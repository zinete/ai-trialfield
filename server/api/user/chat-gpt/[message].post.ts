/**
 * @ Author: ZhengHui
 * @ Create Time: 2025-04-01 13:31:44
 * @ Modified by: ZhengHui
 * @ Modified time: 2025-06-23 13:59:59
 * @ Description:
 */

export default defineEventHandler(async (event) => {
  const { message } = getRouterParams(event);
  try {
    const messages = [
      {
        role: "system",
        content: `每次回答需要直接生成HTML代码，不能包含任何其他内容。请确保生成的HTML代码是完整的，并且可以直接在浏览器中运行。。`,
      },
      {
        role: "user",
        content: message,
      },
    ];
    const ai = hubAI();

    const response: any = await ai.run("@cf/qwen/qwen1.5-7b-chat-awq", {
      stream: false,
      messages,
    });

    setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");

    return response.response;
  } catch (error: any) {
    console.error("API调用错误:", error.message);
    return {
      code: error.response?.status || 500,
      data: null,
      message: error.message || "服务器错误",
    };
  }
});
