<script lang="ts" setup>
import SettingInput from './SettingInput.vue'

const openApiKey = ref("")
const cosSecretId = ref("")
const cosSecretKey = ref("")
</script>

<template>
  <Box :marginBottom="2" width="100%" justifyContent="space-between">
    <Box width="30%">
      <Text dimmed>💬 &lt;- ArrowUp</Text>
    </Box>
    <Box width="30%" justifyContent="center" alignItems="center">
      <Text color="cyanBright">Setting ⚙️</Text>
    </Box>
    <Box width="30%"></Box>
  </Box>
  <Box flexDirection="column" width="100%">
    <SettingInput label="Open Api Key" v-model:value="openApiKey" />
    <SettingInput label="COS Secret Id" v-model:value="cosSecretId" />
    <SettingInput label="COS Secret Key" v-model:value="cosSecretKey" />
  </Box>
  <Box :marginTop="2">
    <Text>💡</Text>
    <Text dimmed>Tips: Press tab to input, press enter to confirm.</Text>
  </Box>
</template>