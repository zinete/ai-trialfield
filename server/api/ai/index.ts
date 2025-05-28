/**
 * @ Author: ZhengHui
 * @ Create Time: 2025-05-28 16:31:24
 * @ Modified by: ZhengHui
 * @ Modified time: 2025-05-28 17:24:06
 * @ Description:
 */

import { runWithTools } from "@cloudflare/ai-utils";

export default defineEventHandler(async (event) => {
  const messages = [
    { role: "system", content: "你是一个前端专家" },
    { role: "user", content: "介绍下二分查找算法" },
  ];

  const ai = hubAI();
  const stream = await ai.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast", {
    stream: true,
    messages,
  });
  return stream;
});
