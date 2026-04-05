<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import SettingInput from './SettingInput.vue'
import { useSettingStore } from './store'

const settingStore = useSettingStore()
const { apiKey, baseUrl, model, currentName } = storeToRefs(settingStore)

// Cycle through provider presets with 'p' key
onKeyData(['p', 'P'], () => {
  settingStore.cycleProvider()
})

// Save config when going back to chat
onKeyData(['ArrowUp'], () => {
  settingStore.saveConfig()
})
</script>

<template>
  <Box :marginBottom="2" width="100%" justifyContent="space-between">
    <Box width="30%">
      <Text dimmed>{{ "\u{1F4AC}" }} &lt;- ArrowUp</Text>
    </Box>
    <Box width="30%" justifyContent="center" alignItems="center">
      <Text color="cyanBright">Setting {{ "\u{1F527}" }}</Text>
    </Box>
    <Box width="30%"></Box>
  </Box>
  <Box flexDirection="column" width="100%">
    <Box :marginBottom="1" alignItems="center">
      <Text color="yellowBright">Provider: </Text>
      <Text color="cyanBright" bold>{{ currentName }}</Text>
      <Text dimmed> (press P to switch)</Text>
    </Box>
    <SettingInput label="API Key" v-model:value="apiKey" />
    <SettingInput label="Base URL" v-model:value="baseUrl" />
    <SettingInput label="Model" v-model:value="model" />
  </Box>
  <Box :marginTop="2" flexDirection="column">
    <Text dimmed>{{ "\u{1F4A1}" }} Tips: Tab to input, Enter to confirm, ArrowUp to save & go back.</Text>
    <Text dimmed>   Press P to cycle providers. Each provider keeps its own API Key.</Text>
  </Box>
</template>
