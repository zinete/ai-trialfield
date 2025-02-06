import { openDB, type DBSchema } from 'idb'

interface StatusDBSchema extends DBSchema {
  status_records: {
    key: number
    value: {
      timestamp: number
      statusCode: number
      responseTime: number
      domain: string
    }
  }
}

export const useIndexDB = () => {
  // Only initialize DB if we're on the client side
  const db = process.client 
    ? openDB<StatusDBSchema>('status-monitor', 1, {
        upgrade(db) {
          db.createObjectStore('status_records', { keyPath: 'timestamp' })
        },
      })
    : null

  const saveStatus = async (domain: string, statusCode: number, responseTime: number) => {
    if (!process.client || !db) return
    
    const timestamp = Date.now();
    (await db).put('status_records', {
      timestamp,
      statusCode,
      responseTime,
      domain
    })
  }

  const getStatusHistory = async (domain: string, duration = 3600000) => {
    if (!process.client || !db) return []
    
    const now = Date.now()
    const since = now - duration
    const records = await (await db).getAll('status_records')
    return records.filter(record => 
      record.domain === domain && 
      record.timestamp >= since
    ).sort((a, b) => a.timestamp - b.timestamp)
  }

  return {
    saveStatus,
    getStatusHistory
  }
}