<script lang="ts" setup>
// All imports are automatic but if you want to import anything,
// remember to import from 'vue-termui':
// import { ref } from 'vue-termui'
import Chat from './Chat.vue'
import Setting from './Setting.vue'

const type = ref('chat')
onKeyData(['ArrowUp'], () => {
  type.value = 'chat'
})
onKeyData(['ArrowDown'], () => {
  type.value = 'setting'
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
    <Chat v-if="type === 'chat'" />
    <Setting v-else-if="type === 'setting'" />
  </Box>
</template>

<style lang="scss">
</style>