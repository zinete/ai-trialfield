
import axios from 'axios'


export default defineEventHandler(async (event) => {
  const rawDomain = decodeURIComponent(event?.context?.params?.domain as string)
  
  try {
    // 如果已经包含协议，直接使用
    if (rawDomain.startsWith('http')) {
      return await checkUrl(rawDomain)
    }

    // 先尝试 HTTPS
    try {
      return await checkUrl(`https://${rawDomain}`)
    } catch (error) {
      // HTTPS 失败则尝试 HTTP
      return await checkUrl(`http://${rawDomain}`)
    }
    
  } catch (error:any) {
    return {
      statusCode: 500,
      message: error?.message,
      responseTime: 0
    }
  }
})

// 检查 URL 可访问性的辅助函数
async function checkUrl(url: string) {
  const startTime = Date.now()
  const response = await axios.get(url, {
    timeout: 10000,
    validateStatus: () => true,
    responseType: "json"
  })
  
  const responseTime = Date.now() - startTime
  
  return {
    statusCode: response.status,
    responseTime,
    headers: response.headers,
    message: response.statusText,
    protocol: url.startsWith('https') ? 'https' : 'http'
  }
}