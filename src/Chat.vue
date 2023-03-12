<script lang="ts" setup>
import { getGPTAnswer } from './gpt'

// 控制动画效果
const n = ref(0)
useInterval(() => {
  n.value++
}, 600)

// 聊天数据
const input = ref("")
const chatList = ref([{
  type: "answer",
  text: "Hi, I am ChatGPT."
}, {
  type: "question",
  text: "Try press TAB to ask some questions."
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
    width="100%"
    flexDirection="column"     
    justifyContent="center" 
    alignItems="center" 
    :marginBottom="2"
  >
    <Box :marginBottom="1" width="100%" justifyContent="space-between">
      <Box width="30%"></Box>
      <Box width="30%" justifyContent="center" alignItems="center">
        <Text color="cyanBright">Welcome </Text>
        <Text>{{ n % 2 ? '👋 ' : ' ✋' }}</Text>
      </Box>
      <Box width="30%" justifyContent="flex-end">
        <Text dimmed>ArrowDown -&gt; ⚙️</Text>
      </Box>
    </Box>
    <Box width="100%" flexDirection="column" :padding="1">
      <Box v-for="(chat, index) in chatList" :key="index" width="100%" flexDirection="column">
        <Box v-if="chat.type === 'question'" width="100%" justifyContent="flex-end" alignItems="center">
          <Box borderColor="greenBright" borderStyle="round" :paddingX="1">
            <Text>
              {{chat.text}} 
            </Text>
          </Box>
          <Text color="grey"> :You</Text>
        </Box>
        <Box v-if="chat.type === 'answer'" alignItems="center">
          <Text color="grey">ChatGPT: </Text>
          <Box borderColor="redBright" borderStyle="round" :paddingX="1">
            <Text>
              {{chat.text}}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  </Box>
  <Box alignItems="center">
    <Input label="" v-model="input" placeholder="Search packages" :disabled="disabled" :marginRight="1" minWidth="65%" />
    <!-- <Text :marginLeft="1" color="grey">sent</Text> -->
  </Box>
  <Box :marginTop="1">
    <Text dimmed>💡 Tips: Press tab to input, press enter to send.</Text>
  </Box>
</template>

<style lang="scss">
</style>