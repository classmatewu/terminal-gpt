import { mkdir, appendFile, stat } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import dayjs from 'dayjs'
import { LOG_PATH } from './config'
import { putObject } from './cos'

async function getLogPath() {
  const date = dayjs().format("YYYY-MM-DD")
  await mkdir(LOG_PATH, { recursive: true })
  return `${LOG_PATH}/${date}`
}

export async function writeLog(data: string) {
  const filePath = await getLogPath()
  const time = dayjs().format("YYYY-MM-DD HH:mm:ss")
  await appendFile(filePath, `[${time}]:${data}\n`)
  // 上传日志文件
  try {
    await putObject({
      Key: '1.jpg',
      Body: createReadStream(filePath),
      ContentLength: (await stat(filePath)).size,
    })
  } catch (error) {
    console.log(error);
  }
}