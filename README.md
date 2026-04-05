# terminal-gpt
> bringing AI Chat to Terminal

- 📦 Out of the box, multi-provider AI chat in your terminal
- 🔄 7 built-in providers: OpenAI, Anthropic, Kimi (K2.5), Together, DeepSeek, Ollama, Custom
- 🌊 Streaming response with real-time token display
- 💬 Multi-turn conversation with context memory
- ⚡️ Per-provider API Key & model configuration
- 🔩 Friendly visual interaction powered by Vue-TermUI

## Supported Providers

| Provider | Default Model | Base URL |
|----------|--------------|----------|
| OpenAI | `gpt-4o` | `https://api.openai.com/v1` |
| Anthropic | `claude-sonnet-4-20250514` | `https://api.anthropic.com/v1` |
| Kimi | `kimi-k2.5` | `https://api.moonshot.cn/v1` |
| Together | `Llama-3.3-70B-Instruct-Turbo` | `https://api.together.xyz/v1` |
| DeepSeek | `deepseek-chat` | `https://api.deepseek.com/v1` |
| Ollama | `llama3.2` | `http://localhost:11434/v1` |
| Custom | (user-defined) | (user-defined) |

All providers use the OpenAI-compatible API format. You can override Base URL and Model for any provider in Settings.

## Install
```
pnpm i tgpt -g
```

## Quick Start
```
tgpt init
```

## Usage

### Chat
> Press **Tab** to focus input, **Enter** to send, **ArrowDown** to open Settings.

- `/clear` — reset conversation history
- `/exit` — quit tgpt
- **ArrowUp / ArrowDown** — browse input history

![chat](https://github.com/classmatewu/terminal-gpt/blob/main/assets/chat.png)

### Settings
> Press **Tab** to input, **Enter** to confirm, **ArrowUp** to save & go back to chat.

- Press **P** to cycle through providers
- Each provider keeps its own API Key, Base URL, and Model
- Config is saved to `~/.tgpt/config.json`

![setting](https://github.com/classmatewu/terminal-gpt/blob/main/assets/setting.png)

## Configuration

Config file location: `~/.tgpt/config.json`

```jsonc
{
  "providerIndex": 0,          // Active provider (0-6)
  "providerKeys": {            // API keys per provider
    "OpenAI": "sk-xxx",
    "Kimi": "sk-xxx"
  },
  "providerOverrides": {       // Optional overrides
    "OpenAI": {
      "model": "gpt-4o-mini"
    }
  }
}
```

## Tech Stack

- [Vue 3](https://vuejs.org/) + [Vue-TermUI](https://github.com/nicepkg/vue-termui) — terminal UI framework
- [Pinia](https://pinia.vuejs.org/) — state management
- [Vite](https://vitejs.dev/) — build tool
- TypeScript

## License
MIT © classmatewu
