<script lang="ts" setup>
/**
 * CjkInput — backward-compatible alias for TextInput.
 * TextInput now handles CJK natively, so this is a thin passthrough.
 */
import TextInput from './TextInput.vue'
</script>

<template>
  <TextInput v-bind="$attrs">
    <slot />
  </TextInput>
</template>
