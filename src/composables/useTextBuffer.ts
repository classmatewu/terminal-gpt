/**
 * useTextBuffer — composable that manages a character-level text buffer
 * with cursor, supporting CJK/emoji (surrogate-pair safe).
 *
 * Extracted from TextInput so it can be unit-tested and reused.
 */
import { ref, computed } from 'vue'

/** Split string into user-perceived characters (handles surrogates & ZWJ emoji) */
function toChars(s: string): string[] {
  // Segmenter is the gold standard for grapheme clusters,
  // but not available in all Node versions. Fall back to Array.from.
  if (typeof Intl !== 'undefined' && (Intl as any).Segmenter) {
    const seg = new (Intl as any).Segmenter(undefined, { granularity: 'grapheme' })
    return [...seg.segment(s)].map((g: any) => g.segment)
  }
  return Array.from(s)
}

export function useTextBuffer(initial = '') {
  const text = ref(initial)
  const cursor = ref(0)

  const chars = computed(() => toChars(text.value))
  const length = computed(() => chars.value.length)

  // ── Mutations ──

  function insert(ch: string) {
    const c = [...chars.value]
    c.splice(cursor.value, 0, ch)
    text.value = c.join('')
    cursor.value++
  }

  function backspace() {
    if (cursor.value <= 0) return
    const c = [...chars.value]
    c.splice(cursor.value - 1, 1)
    text.value = c.join('')
    cursor.value--
  }

  function deleteForward() {
    if (cursor.value >= length.value) return
    const c = [...chars.value]
    c.splice(cursor.value, 1)
    text.value = c.join('')
  }

  // ── Navigation ──

  function moveLeft() {
    cursor.value = Math.max(0, cursor.value - 1)
  }

  function moveRight() {
    cursor.value = Math.min(length.value, cursor.value + 1)
  }

  function moveHome() {
    cursor.value = 0
  }

  function moveEnd() {
    cursor.value = length.value
  }

  // ── Line-editing (Emacs / readline style) ──

  /** Ctrl+U — kill from cursor to start */
  function killToStart() {
    const c = [...chars.value]
    text.value = c.slice(cursor.value).join('')
    cursor.value = 0
  }

  /** Ctrl+K — kill from cursor to end */
  function killToEnd() {
    const c = [...chars.value]
    text.value = c.slice(0, cursor.value).join('')
  }

  /** Ctrl+W — kill previous word */
  function killWord() {
    if (cursor.value <= 0) return
    const c = [...chars.value]
    let i = cursor.value - 1
    // skip trailing spaces
    while (i > 0 && c[i] === ' ') i--
    // skip word chars
    while (i > 0 && c[i - 1] !== ' ') i--
    const removed = cursor.value - i
    c.splice(i, removed)
    text.value = c.join('')
    cursor.value = i
  }

  /** Clear all text and reset cursor */
  function clear() {
    text.value = ''
    cursor.value = 0
  }

  /** Set text programmatically (resets cursor to end) */
  function setText(v: string) {
    text.value = v
    cursor.value = toChars(v).length
  }

  return {
    text,
    cursor,
    chars,
    length,
    // mutations
    insert,
    backspace,
    deleteForward,
    // navigation
    moveLeft,
    moveRight,
    moveHome,
    moveEnd,
    // line editing
    killToStart,
    killToEnd,
    killWord,
    clear,
    setText,
  }
}
