<script lang="ts" setup>
/**
 * TextInput — from-scratch terminal input component for vue-termui.
 *
 * Architecture:
 *   useTextBuffer   — character-safe text + cursor management (CJK / emoji)
 *   useCursorBlink  — blink timer, reset on keystroke
 *   useInputHistory — ArrowUp/Down through sent messages
 *
 * Features:
 *   ✅ CJK / surrogate-pair / emoji safe (Intl.Segmenter where available)
 *   ✅ Readline-style shortcuts (Ctrl+A/E/U/K/W)
 *   ✅ ArrowUp/Down history browsing
 *   ✅ Focus management via vue-termui useFocus
 *   ✅ Cursor blink with keystroke reset
 *   ✅ Placeholder & disabled states
 */
import { useFocus } from 'vue-termui'
import { useTextBuffer } from './composables/useTextBuffer'
import { useCursorBlink } from './composables/useCursorBlink'
import { useInputHistory } from './composables/useInputHistory'

const props = defineProps({
  modelValue: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: '' },
  minWidth: { type: Number, default: 10 },
  /** Enable ArrowUp/Down history browsing */
  history: { type: Boolean, default: false },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'submit', value: string): void
}>()

// ─── Text buffer ───
const buf = useTextBuffer(props.modelValue)

// Sync props → buffer
watch(() => props.modelValue, (v) => {
  if (v !== buf.text.value) {
    buf.setText(v)
  }
})
// Sync buffer → parent
watch(() => buf.text.value, (v) => {
  if (v !== props.modelValue) {
    emit('update:modelValue', v)
  }
})

// ─── Focus ───
const { active } = useFocus({ disabled: toRef(props, 'disabled') })

// ─── Cursor blink ───
const { visible: cursorVisible, reset: resetBlink } = useCursorBlink(530)

// ─── History ───
const hist = useInputHistory()

// ─── Display rendering ───
const displayText = computed(() => {
  if (props.disabled || !active.value) {
    return buf.text.value || props.placeholder
  }

  const c = buf.chars.value
  const pos = Math.min(buf.cursor.value, c.length)
  const before = c.slice(0, pos).join('')
  const cursorChar = cursorVisible.value
    ? '\u2588'
    : (pos < c.length ? c[pos] : ' ')
  const after = pos < c.length ? c.slice(pos + 1).join('') : ''

  return before + cursorChar + after
})

const isPlaceholder = computed(() => !buf.text.value && !active.value)

// ─── Key dispatch ───
onInputData(({ data, event }) => {
  if (!active.value || props.disabled) return
  if (!event || typeof event !== 'object' || !('key' in event)) return

  const e = event as {
    key: string
    ctrlKey?: boolean
    altKey?: boolean
    metaKey?: boolean
  }
  const key = e.key

  // ── Backspace (handles raw \x7f from some terminals) ──
  if (key === 'Backspace' || key === '\x7f') {
    buf.backspace()
    hist.resetBrowse()
    resetBlink()
    return
  }

  // ── Delete ──
  if (key === 'Delete' || key === '\x1b[3~') {
    buf.deleteForward()
    hist.resetBrowse()
    resetBlink()
    return
  }

  // ── Arrow Left / Right ──
  if (key === 'ArrowLeft') { buf.moveLeft(); resetBlink(); return }
  if (key === 'ArrowRight') { buf.moveRight(); resetBlink(); return }

  // ── Arrow Up / Down — history browsing ──
  if (props.history && key === 'ArrowUp') {
    const entry = hist.up(buf.text.value)
    if (entry != null) buf.setText(entry)
    resetBlink()
    return
  }
  if (props.history && key === 'ArrowDown') {
    const entry = hist.down()
    if (entry != null) buf.setText(entry)
    resetBlink()
    return
  }

  // ── Ctrl combos (readline) ──
  if (e.ctrlKey) {
    switch (key.toLowerCase()) {
      case 'a': buf.moveHome(); break
      case 'e': buf.moveEnd(); break
      case 'u': buf.killToStart(); break
      case 'k': buf.killToEnd(); break
      case 'w': buf.killWord(); break
      default: return
    }
    resetBlink()
    return
  }

  // ── Skip non-printable / modifier keys ──
  if (e.altKey || e.metaKey) return
  if (key.length > 1) return           // function keys etc.
  if (key.codePointAt(0)! < 32) return  // control chars

  // ── Normal character insertion (ASCII, CJK, emoji) ──
  buf.insert(key)
  hist.resetBrowse()
  resetBlink()
})

// ─── Expose for parent components ───
defineExpose({
  /** Push current text to history (call after submit) */
  pushHistory: (text: string) => hist.push(text),
  /** Clear the input */
  clear: () => buf.clear(),
})
</script>

<template>
  <Box
    borderStyle="round"
    :borderColor="disabled ? 'gray' : active ? 'blue' : 'greyBright'"
    :height="3"
    :minWidth="props.minWidth"
    :paddingX="1"
  >
    <Text v-if="isPlaceholder" dimmed>{{ props.placeholder }}</Text>
    <Text v-else :dimmed="props.disabled">{{ displayText }}</Text>
  </Box>
</template>
