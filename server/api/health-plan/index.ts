import axios from "axios";
export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const axiosInstance = axios.create({
    timeout: 30000,
    baseURL: config.apiBaseUrl,
  });
  const { history } = await readBody(event);

  // 模板 { content: "呼啦圈 2000个", frequency: "daily" },

  let template = [{ content: "呼啦圈 2000个", frequency: "daily" }];

  try {
    const res = await axiosInstance.post(
      "/chat/completions",
      {
        model: config.aiModel,
        stream: true,
        messages: [
          {
            role: "system",
            content: `
                        你是一个专业的健康顾问，你的任务是为用户提供个性化的健康建议。每次回答问题结尾，都需要带上 元宝AI😘随时为你提供服务 。`,
          },
          ...history,
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${config.apiKey}`,
          "Content-Type": "application/json",
        },
        responseType: "stream",
      }
    );

    setHeader(event, "Content-Type", "text/event-stream");
    setHeader(event, "Cache-Control", "no-cache");
    setHeader(event, "Connection", "keep-alive");

    return sendStream(event, res.data);
  } catch (error: any) {
    console.error("API调用错误:", error.message);
    return {
      code: error.response?.status || 500,
      data: null,
      message: error.message || "服务器错误",
    };
  }
});
