import { Ollama } from "ollama";

export default defineEventHandler(async (event) => {
  const ollama = new Ollama({ host: "http://127.0.0.1:11434" });
  const body = await readBody(event);
  const history = body?.history || [];
  const content = decodeURIComponent(event?.context?.params?.message as string);
  const isDeepThinking = body?.isDeepThinking || false;

  try {
    setHeader(event, "Content-Type", "text/event-stream");
    setHeader(event, "Cache-Control", "no-cache");
    setHeader(event, "Connection", "keep-alive");

    const response = await ollama.chat({
      model: "deepseek-r1:1.5b",
      stream: true,
      messages: [
        ...history,
        {
          role: "user",
          content: isDeepThinking
            ? `请深入思考以下问题，并分析其核心要点：${content}`
            : content,
        },
      ],
    });

    // 直接使用 sendStream 发送事件流
    return sendStream(event, async (stream) => {
      for await (const chunk of response) {
        await stream.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }
      await stream.write("data: [DONE]\n\n");
    });
  } catch (error) {
    console.error("Stream error:", error);
    return {
      code: 500,
      data: null,
      message: "服务器错误",
    };
  }
});
