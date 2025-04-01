const options = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer sk-fkjwfsdjtjysgxovxevnhjnocrjazkxfaqlwkcexbgitxljh',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    model: "deepseek-ai/DeepSeek-V3",
    messages: [
      {
        role: "user",
        content: "上海有哪些骑行好路线"
      }
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
                description: "路线名称"
              },
              description: {
                type: "string",
                description: "路线详细描述"
              },
              startPoint: {
                type: "string",
                description: "起点位置"
              },
              endPoint: {
                type: "string",
                description: "终点位置"
              },
              estimatedDistance: {
                type: "number",
                description: "预计距离（公里）"
              },
              estimatedDuration: {
                type: "string",
                description: "预计用时"
              },
              difficulty: {
                type: "string",
                enum: ["easy", "medium", "hard"],
                description: "路线难度"
              },
              waypoints: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "途经点列表"
              },
              scenicSpots: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "沿途景点"
              },
              tips: {
                type: "array",
                items: {
                  type: "string"
                },
                description: "骑行建议"
              },
              bestTimeToRide: {
                type: "string",
                description: "最佳骑行时间"
              }
            },
            required: [
              "title",
              "description",
              "startPoint",
              "endPoint",
              "estimatedDistance",
              "difficulty",
              "waypoints"
            ]
          },
          strict: false
        }
      }
    ]
  })
};

fetch('https://api.siliconflow.cn/v1/chat/completions', options)
  .then(response => response.json())
  .then(response => console.log(response))
  .catch(err => console.error(err));