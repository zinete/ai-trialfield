import { Ollama } from 'ollama'

export default defineEventHandler(async (event) => {
  const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })
  const body = await readBody(event)
  const history = body?.history || []
  const content = decodeURIComponent(event?.context?.params?.message as string)

  try {
    const response = await ollama.chat({
      model: 'deepseek-r1:1.5b',  // 使用您已安装的模型名称
      
     
      messages: [
        ...history,
        { role: 'user', content }
      ],
    })

    return {
      code: 200,
      data: response,
      message: response.message?.content || '无回复'
    }
  } catch (error) {
    return {
      code: 500,
      data: null,
      message: '服务器错误'
    }
  }
})