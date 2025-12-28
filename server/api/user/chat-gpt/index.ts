/**
 * @ Author: ZhengHui
 * @ Create Time: 2025-04-01 13:31:44
 * @ Modified by: ZhengHui
 * @ Modified time: 2025-12-28 13:45:15
 * @ Description:
 */

export default defineEventHandler(async (event) => {
  const { history, systemPrompt } = await readBody(event);
  try {
    const messages = [
      {
        role: "system",
        content: `${systemPrompt}, 你必须只输出最终结论，禁止输出分析、推理、解释、思考过程。`,
      },
      ...history,
    ];
    const ai = hubAI();

    const stream = await ai.run(
      "@cf/deepseek-ai/deepseek-r1-distill-qwen-32b",
      {
        stream: true,
        messages,
      }
    );

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
