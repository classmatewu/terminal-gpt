# terminal-gpt
> bringing ChatGPT to Terminal

- 📦 Out of the box feature
- 🛠️ Base on gpt-3.5-turbo-0301 model
- 💡 Backup chat history to Tencent COS
- ⚡️ Configure on demand
- 🔩 Friendly visual interaction

## Install
```
pnpm i tgpt -g
```

## Call out
```
tgpt init
```

## Chat
> Press Tab to input, press Enter to send, press ArrowDown to setting.

![chat.pnh](https://github.com/classmatewu/terminal-gpt/blob/main/assets/chat.png)

## Setting
> Press Tab to input, press ArrowUp to go back chat.

![setting.pnh](https://github.com/classmatewu/terminal-gpt/blob/main/assets/setting.png)

## BFF
> You also can think of it as a forwarding service call
```
curl -d'text=hello'-X POST https://localhost:7301/chat
```

## Setting use command
```
tgpt set openai-api-key xxxxxx
tgpt set cos-secret-id xxxxxx
tgpt set cos-secret-key xxxxxx
tgpt set cos-bucket xxxxxx
tgpt set cos-region xxxxxx
```

## License
MIT © classmatewu