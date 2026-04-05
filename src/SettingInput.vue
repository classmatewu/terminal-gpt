<script lang="ts" setup>
import TextInput from './TextInput.vue'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: String, default: '' }
})
const emit = defineEmits(['update:value'])

const settingVal = ref(props.value)

watch(() => props.value, (v) => {
  settingVal.value = v
})

// Sync back to parent on EVERY keystroke, not just Enter
watch(settingVal, (v) => {
  emit('update:value', v)
})
</script>

<template>
  <Box justifyContent="center" alignItems="center" width="100%">
    <Box width="22%">
      <Text color="greyBright">{{ props.label }}: </Text>
    </Box>
    <TextInput v-model="settingVal" :minWidth="40" />
  </Box>
</template>
