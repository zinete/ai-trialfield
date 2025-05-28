import axios from "axios";
import type { CyclingRequest, CyclingRoute } from "../../../types/cycling";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const body = await readBody(event);
  const {
    message,
    startPoint,
    preferences,
  }: {
    message: string;
    startPoint: string;
    preferences: CyclingRequest["preferences"];
  } = body;

  try {
    if (!message)
      return {
        code: 400,
        message: "缺少参数",
      };
    // 调用 AI 生成路线描述
    const aiResponse = await axios.post(
      "https://api.siliconflow.cn/v1/chat/completions",
      {
        model: "deepseek-ai/DeepSeek-V3",
        messages: [
          {
            role: "system",
            content:
              "你是一个专业的骑行路线规划助手。请为用户推荐2-3条不同特点的路线。",
          },
          {
            role: "user",
            content: `
起点：${startPoint}
距离要求：${preferences.distance || "不限"}公里
难度要求：${preferences.difficulty || "不限"}
时间偏好：${preferences.timeOfDay || "不限"}
用户需求：${message}

请推荐2-3条适合的骑行路线，每条路线的特点要有所不同。`,
          },
        ],
        stream: false,
        max_tokens: 512,
        stop: ["null"],
        temperature: 0.7,
        top_p: 0.7,
        top_k: 50,
        frequency_penalty: 0.5,
        n: 1,
        response_format: { type: "text" },
        tools: [
          {
            type: "function",
            function: {
              description: "生成骑行路线建议",
              name: "generateCyclingRoute",
              parameters: {
                type: "object",
                properties: {
                  title: {
                    type: "string",
                    description: "路线名称",
                  },
                  description: {
                    type: "string",
                    description: "路线详细描述",
                  },
                  startPoint: {
                    type: "string",
                    description: "起点位置",
                  },
                  endPoint: {
                    type: "string",
                    description: "终点位置",
                  },
                  estimatedDistance: {
                    type: "number",
                    description: "预计距离（公里）",
                  },
                  estimatedDuration: {
                    type: "string",
                    description: "预计用时",
                  },
                  difficulty: {
                    type: "string",
                    enum: ["easy", "medium", "hard"],
                    description: "路线难度",
                  },
                  waypoints: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "途经点列表",
                  },
                  scenicSpots: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "沿途景点",
                  },
                  tips: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                    description: "骑行建议",
                  },
                  bestTimeToRide: {
                    type: "string",
                    description: "最佳骑行时间",
                  },
                },
                required: [
                  "title",
                  "description",
                  "startPoint",
                  "endPoint",
                  "estimatedDistance",
                  "difficulty",
                  "waypoints",
                ],
              },
              strict: false,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer sk-fkjwfsdjtjysgxovxevnhjnocrjazkxfaqlwkcexbgitxljh`,
          "Content-Type": "application/json",
        },
      }
    );

    // 处理多条路线
    const routes = await Promise.all(
      (aiResponse.data.choices[0]?.message?.tool_calls || []).map(
        async (toolCall: any) => {
          if (toolCall.function?.name === "generateCyclingRoute") {
            const routeData = JSON.parse(toolCall.function.arguments);
            const routePoints = await getRoutePoints(
              startPoint,
              JSON.stringify(routeData)
            );
            return {
              ...routeData,
              content: formatAIResponse(JSON.stringify(routeData)),
              mapData: routePoints,
            };
          }
          return null;
        }
      )
    );

    return {
      code: 200,
      data: {
        routes: routes.filter(Boolean),
        total: routes.filter(Boolean).length,
        content: routes.filter(Boolean)[0]?.content,
        route: routes.filter(Boolean)[0],
      },
    };
  } catch (error: any) {
    console.error("路线规划错误:", error);
    return {
      code: error.response?.status || 500,
      data: null,
      message: error.message || "服务器错误",
    };
  }
});

async function getRoutePoints(startPoint: string, routeData: string) {
  if (!routeData) return null;

  const routeInfo = JSON.parse(routeData);
  const waypoints = routeInfo.waypoints;

  // 添加延迟函数
  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // 添加重试函数
  const retryGeocode = async (
    address: string,
    retries = 3
  ): Promise<string> => {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await getGeocode(address);
        // 每次成功请求后等待一秒
        await delay(1000);
        return result;
      } catch (error) {
        if (i === retries - 1) throw error;
        // 失败后等待更长时间再重试
        await delay(2000 * (i + 1));
      }
    }
    throw new Error(`获取地址坐标失败：${address}`);
  };

  try {
    const [origin, destination, ...waypointCoords] = await Promise.all([
      retryGeocode(startPoint),
      retryGeocode(waypoints[waypoints.length - 1]),
      ...waypoints.slice(0, -1).map((point: any) => retryGeocode(point)),
    ]);

    const params = new URLSearchParams({
      key: "d27a33090d382a1993955a6014f81a74",
      origin,
      destination,
      waypoints: waypointCoords.join(";"),
      strategy: "2",
      output: "json",
    });

    // 添加请求延迟
    await delay(1000);

    const response = await axios.get(
      `https://restapi.amap.com/v3/direction/driving?${params.toString()}`
    );

    if (response.data.status === "1") {
      return {
        ...routeInfo,
        path: response.data.route.paths[0].steps.map((step: any) =>
          step.polyline.split(";")
        ),
      };
    }
  } catch (error) {
    console.error("路线规划错误:", error);
  }
  return null;
}

async function getGeocode(address: string): Promise<string> {
  const params = new URLSearchParams();
  params.append("key", "d27a33090d382a1993955a6014f81a74");
  params.append("address", address);

  const response = await axios.post(
    "https://restapi.amap.com/v3/geocode/geo",
    params,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  console.log("地理编码响应:", response.data);

  if (response.data.status === "1" && response.data.geocodes.length > 0) {
    return response.data.geocodes[0].location;
  }
  throw new Error(`无法获取地址坐标：${address}`);
}

function formatAIResponse(routeData: string): string {
  const route = JSON.parse(routeData);
  return `### 🚴‍♂️ ${route.title}

📝 **路线描述**
${route.description}

📊 **基本信息**
- 预计距离：${route.estimatedDistance}公里
- 预计用时：${route.estimatedDuration}
- 路线难度：${getDifficultyText(route.difficulty)}

🗺 **途经点**
${route.waypoints.map((point: string) => `- ${point}`).join("\n")}

💡 **骑行建议**
${route.tips.map((tip: string) => `- ${tip}`).join("\n")}

祝您骑行愉快！🚴‍♂️`;
}

function getDifficultyText(difficulty: string): string {
  const difficultyMap = {
    easy: "轻松休闲 🟢",
    medium: "中等强度 🟡",
    hard: "具有挑战 🔴",
  };
  return difficultyMap[difficulty as keyof typeof difficultyMap] || "未知";
}
