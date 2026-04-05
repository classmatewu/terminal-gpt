/**
 * useCursorBlink — composable for managing cursor blink state.
 * Resets the blink to "visible" on every keystroke, then toggles.
 */
import { ref, onMounted, onUnmounted } from 'vue'

export function useCursorBlink(intervalMs = 530) {
  const visible = ref(true)
  let timer: ReturnType<typeof setInterval> | null = null

  function start() {
    stop()
    visible.value = true
    timer = setInterval(() => { visible.value = !visible.value }, intervalMs)
  }

  function stop() {
    if (timer) {
      clearInterval(timer)
      timer = null
    }
  }

  /** Call on every keystroke to reset blink to visible */
  function reset() {
    start()
  }

  onMounted(start)
  onUnmounted(stop)

  return { visible, reset }
}
