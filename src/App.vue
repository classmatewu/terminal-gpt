<script lang="ts" setup>
// All imports are automatic but if you want to import anything,
// remember to import from 'vue-termui':
// import { ref } from 'vue-termui'
import { getGPTAnswer } from './gpt.ts'

// 控制动画效果
const n = ref(0)
useInterval(() => {
  n.value++
}, 600)

// 聊天数据
const input = ref("")
const chatList = ref([{
  type: "question",
  text: "hello"
}, {
  type: "answer",
  text: "hi"
}])
onKeyData(['Enter'], async () => {
  const question = {
    type: "question",
    text: input.value
  }
  chatList.value.push(question)
  input.value = ""
  disabled.value = true
  const answer = await getGPTAnswer(question)
  chatList.value.push(answer)
  disabled.value = false
})

// 输入框状态
const disabled = ref(false)
onKeyData(['d', 'D'], () => {
  disabled.value = !disabled.value
})

</script>

<template>
  <Box
    :padding="1"
    width="100%"
    :maxWidth="80"
    flexDirection="column"
    borderColor="yellowBright"
    borderStyle="round"
  >
    <Box 
      :marginBottom="1" 
      width="100%"   
      justifyContent="center"
      alignItems="center"
    >
      <Text color="cyanBright">Hello World </Text>
      <Text>{{ n % 2 ? '👋 ' : ' ✋' }}</Text>
    </Box>
    <Box v-for="(chat, index) in chatList" :key="index">
      <Text v-if="chat.type === 'question'">
        Me: {{chat.text}}
      </Text>
      <Text v-if="chat.type === 'answer'">
        You: {{chat.text}}
      </Text>
    </Box>
    <Input label="message: " v-model="input" placeholder="Search packages" :disabled="disabled" />
  </Box>
</template>
