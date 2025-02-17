

import axios from 'axios'

export default defineEventHandler(async (event) => {
    const axiosInstance = axios.create({
        timeout: 30000,
        baseURL: 'https://api.siliconflow.cn/v1'
    })
    const {  history } = await readBody(event)



    // 模板 { content: "呼啦圈 2000个", frequency: "daily" },

    let template = [
        { content: "呼啦圈 2000个", frequency: "daily" }
    ]
    
    try {
        const res = await axiosInstance.post('/chat/completions', {
            model: 'Qwen/Qwen2-VL-72B-Instruct',
            // frequency_penalty: 0,
            // max_tokens: 8192,
            // temperature: 0.7,
            // top_k: 50,
            // top_p: 0.7,
            messages: [
                {
                    role: 'system',
                    content: `
                        你是一个专业的健康顾问，你的任务是为用户提供个性化的健康建议。每次回答问题结尾，都需要带上 元宝AI😘随时为你提供服务 。`
                },
                ...history,
            ],
          
        }, {
            headers: {
                'Authorization': 'Bearer sk-fkjwfsdjtjysgxovxevnhjnocrjazkxfaqlwkcexbgitxljh',
                'Content-Type': 'application/json'
            },
        })

        return {
            code: 200,
            data: res.data.choices[0]?.message,
            message: 'success'
        }
    } catch (error: any) {
        console.error('API调用错误:', error.message)
        return {
            code: error.response?.status || 500,
            data: null,
            message: error.message || '服务器错误'
        }
    }
})