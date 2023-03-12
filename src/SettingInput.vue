<script lang="ts" setup>
const props = defineProps({
  label: { type: String, default: true }, 
  value: { type: String, default: true }
});
const emit = defineEmits(['update:value']);

const settingVal = ref(props.value)
onKeyData(['Enter'], () => {
  emit('update:value', settingVal.value)
})
</script>

<template>
  <Box justifyContent="center" alignItems="center" width="100%">
    <Box width="22%">
      <Text color="grey">{{props.label}}: </Text>
    </Box>
    <Input label="" v-model="settingVal" :marginRight="1" minWidth="60%" />
  </Box>
</template>