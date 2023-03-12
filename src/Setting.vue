<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import SettingInput from './SettingInput.vue'
import { useSettingStore } from './store'
import { setChatGPTInstance } from './gpt'
import { setCOSInstance } from './cos'

const settingStore = useSettingStore()
const { openaiApiKey, cosSecretId, cosSecretKey, cosBucket, cosRegion } = storeToRefs(settingStore)

onKeyData(['ArrowUp'], () => {
  setChatGPTInstance(openaiApiKey.toString())
  setCOSInstance({
    SecretId: cosSecretId.toString(),
    SecretKey: cosSecretKey.toString(),
    Bucket: cosBucket.toString(),
    Region: cosRegion.toString()
  })
})
</script>

<template>
  <Box :marginBottom="2" width="100%" justifyContent="space-between">
    <Box width="30%">
      <Text dimmed>💬 &lt;- ArrowUp</Text>
    </Box>
    <Box width="30%" justifyContent="center" alignItems="center">
      <Text color="cyanBright">Setting 🔧</Text>
    </Box>
    <Box width="30%"></Box>
  </Box>
  <Box flexDirection="column" width="100%">
    <SettingInput label="Openai Api Key" v-model:value="openaiApiKey" />
    <SettingInput label="COS Secret Id" v-model:value="cosSecretId" />
    <SettingInput label="COS Secret Key" v-model:value="cosSecretKey" />
    <SettingInput label="COS Bucket" v-model:value="cosSecretKey" />
    <SettingInput label="COS Region" v-model:value="cosSecretKey" />
  </Box>
  <Box :marginTop="2">
    <Text>💡</Text>
    <Text dimmed>Tips: Press Tab to input, press ArrowUp to go back chat.</Text>
  </Box>
</template>