/**
 * useInputHistory — composable for navigating input history with ArrowUp/Down.
 */
import { ref } from 'vue'

export function useInputHistory(maxSize = 100) {
  const history = ref<string[]>([])
  /** -1 = not browsing; 0..n = browsing index from the end */
  const browseIndex = ref(-1)
  /** Stash the current (unsent) input while browsing */
  let stash = ''

  function push(text: string) {
    if (!text.trim()) return
    // Deduplicate consecutive entries
    if (history.value.length > 0 && history.value[history.value.length - 1] === text) return
    history.value.push(text)
    if (history.value.length > maxSize) history.value.shift()
    browseIndex.value = -1
  }

  /**
   * Navigate up (older). Returns the history entry or null if at the top.
   * @param currentText — the current input text (stashed on first up-press)
   */
  function up(currentText: string): string | null {
    if (history.value.length === 0) return null
    if (browseIndex.value === -1) {
      stash = currentText
      browseIndex.value = history.value.length - 1
    } else if (browseIndex.value > 0) {
      browseIndex.value--
    } else {
      return null // already at oldest
    }
    return history.value[browseIndex.value]
  }

  /** Navigate down (newer). Returns entry, stashed text, or null. */
  function down(): string | null {
    if (browseIndex.value === -1) return null
    if (browseIndex.value < history.value.length - 1) {
      browseIndex.value++
      return history.value[browseIndex.value]
    }
    // Back to current input
    browseIndex.value = -1
    return stash
  }

  function resetBrowse() {
    browseIndex.value = -1
  }

  return { history, push, up, down, resetBrowse }
}
