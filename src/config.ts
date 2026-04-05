import { homedir } from 'node:os'
import { join } from 'node:path'

export const CONFIG_DIR = join(homedir(), '.tgpt')
export const CONFIG_FILE = join(CONFIG_DIR, 'config.json')
export const LOG_PATH = join(CONFIG_DIR, 'logs')

// Default provider presets
export interface ProviderPreset {
  name: string
  baseUrl: string
  defaultModel: string
}

export const PROVIDER_PRESETS: ProviderPreset[] = [
  { name: 'OpenAI', baseUrl: 'https://api.openai.com/v1', defaultModel: 'gpt-4o' },
  { name: 'Anthropic (OpenAI-compat)', baseUrl: 'https://api.anthropic.com/v1', defaultModel: 'claude-sonnet-4-20250514' },
  { name: 'Kimi', baseUrl: 'https://api.moonshot.cn/v1', defaultModel: 'kimi-k2.5' },
  { name: 'Together', baseUrl: 'https://api.together.xyz/v1', defaultModel: 'meta-llama/Llama-3.3-70B-Instruct-Turbo' },
  { name: 'DeepSeek', baseUrl: 'https://api.deepseek.com/v1', defaultModel: 'deepseek-chat' },
  { name: 'Ollama', baseUrl: 'http://localhost:11434/v1', defaultModel: 'llama3.2' },
  { name: 'Custom', baseUrl: '', defaultModel: '' },
]
