<script lang="ts" setup>
// All imports are automatic but if you want to import anything,
// remember to import from 'vue-termui':
// import { ref } from 'vue-termui'
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
    :padding="1"
    width="100%"
    :maxWidth="80"
    :minHeight="18"
    flexDirection="column"
    borderColor="greyBright"
    borderStyle="round"
    justifyContent="space-between"
    alignItems="center"
  >
    <Box flexDirection="column"     justifyContent="center" width="100%"
    alignItems="center" :marginBottom="2">
      <Box :marginBottom="1">
        <Text color="cyanBright">Welcome </Text>
        <Text>{{ n % 2 ? '👋 ' : ' ✋' }}</Text>
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
      <Input label="" v-model="input" placeholder="Search packages" :disabled="disabled" :marginRight="1" minWidth="60%" />
      <Text :marginLeft="1" color="grey">sent</Text>
    </Box>
  </Box>
</template>

<style lang="scss">
</style>