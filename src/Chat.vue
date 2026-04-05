<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSettingStore } from './store'
import { streamGPTAnswer, clearHistory } from './gpt'
import TextInput from './TextInput.vue'

const settingStore = useSettingStore()
const { apiKey, baseUrl, model } = storeToRefs(settingStore)

// Load config on mount
settingStore.loadConfig()

// Animation
const n = ref(0)
useInterval(() => {
  n.value++
}, 600)

// Chat state
const input = ref('')
const textInputRef = ref<InstanceType<typeof TextInput> | null>(null)
const chatList = ref<Array<{ type: string; text: string }>>([
  { type: 'answer', text: 'Hi! I am your AI assistant. Set your API key in Settings (ArrowDown), then ask me anything.' },
])
const isStreaming = ref(false)
const streamingText = ref('')

onKeyData(['Enter'], async () => {
  const text = input.value.trim()
  if (!text || isStreaming.value) return

  if (text === '/clear') {
    chatList.value = [{ type: 'answer', text: 'Chat cleared. Ask me anything!' }]
    clearHistory()
    input.value = ''
    return
  }

  if (text === '/exit') {
    process.exit(0)
  }

  // Push to history before clearing
  textInputRef.value?.pushHistory(text)

  const question = { type: 'question', text }
  chatList.value.push(question)
  input.value = ''
  isStreaming.value = true
  streamingText.value = ''

  const answerIndex = chatList.value.length
  chatList.value.push({ type: 'answer', text: '...' })

  await streamGPTAnswer(
    text,
    { apiKey: apiKey.value, baseUrl: baseUrl.value, model: model.value },
    {
      onToken(token: string) {
        streamingText.value += token
        chatList.value[answerIndex].text = streamingText.value
      },
      onDone(_fullText: string) {
        isStreaming.value = false
      },
      onError(error: string) {
        chatList.value[answerIndex].text = `Error: ${error}`
        isStreaming.value = false
      },
    }
  )
})
</script>

<template>
  <Box
    width="100%"
    flexDirection="column"
    justifyContent="center"
    alignItems="center"
    :marginBottom="2"
  >
    <Box :marginBottom="1" width="100%" justifyContent="space-between">
      <Box width="30%"></Box>
      <Box width="30%" justifyContent="center" alignItems="center">
        <Text color="cyanBright">Terminal GPT </Text>
        <Text>{{ n % 2 ? "\u{1F44B} " : " \u270B" }}</Text>
      </Box>
      <Box width="30%" justifyContent="flex-end">
        <Text dimmed>ArrowDown -> {{ "\u{1F527}" }}</Text>
      </Box>
    </Box>
    <Box width="100%" flexDirection="column" :padding="1">
      <Box v-for="(chat, index) in chatList" :key="index" width="100%" flexDirection="column">
        <Box v-if="chat.type === 'question'" width="100%" justifyContent="flex-end" alignItems="center">
          <Box borderColor="greenBright" borderStyle="round" :paddingX="1" maxWidth="80%">
            <Text>{{ chat.text }}</Text>
          </Box>
          <Text color="greyBright"> :You</Text>
        </Box>
        <Box v-if="chat.type === 'answer'" alignItems="center">
          <Text color="greyBright">AI: </Text>
          <Box borderColor="cyanBright" borderStyle="round" :paddingX="1" maxWidth="80%">
            <Text>{{ chat.text }}{{ isStreaming && index === chatList.length - 1 ? (n % 2 ? "\u2588" : " ") : "" }}</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
  <Box alignItems="center" justifyContent="center" width="100%">
    <TextInput
      ref="textInputRef"
      v-model="input"
      :placeholder="isStreaming ? 'AI is thinking...' : 'Type your message...'"
      :disabled="isStreaming"
      :minWidth="60"
      :history="true"
    />
  </Box>
  <Box :marginTop="1" flexDirection="column">
    <Text dimmed>{{ "\u{1F4A1}" }} Tab to focus input, Enter to send, /clear to reset, /exit to quit.</Text>
    <Text v-if="!apiKey" color="yellowBright">{{ "\u26A0\uFE0F" }}  No API Key set. Press ArrowDown to configure.</Text>
  </Box>
</template>

<style lang="scss">
</style>
