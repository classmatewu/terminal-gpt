import { mkdir, appendFile } from 'node:fs/promises'
import dayjs from 'dayjs'
import { LOG_PATH } from './config'

async function getLogPath() {
  const date = dayjs().format('YYYY-MM-DD')
  await mkdir(LOG_PATH, { recursive: true })
  return `${LOG_PATH}/${date}.log`
}

export async function writeLog(data: string) {
  try {
    const filePath = await getLogPath()
    const time = dayjs().format('YYYY-MM-DD HH:mm:ss')
    await appendFile(filePath, `[${time}]: ${data}\n`)
  } catch {
    // Logging should never break the app
  }
}
