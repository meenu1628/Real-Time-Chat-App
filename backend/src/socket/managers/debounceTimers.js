// /realtime/managers/debounceTimerManager.js

const debounceTimers = new Map()


export function debounce(id, fn, delay = 3000) {
  if (debounceTimers.has(id)) {
    clearTimeout(debounceTimers.get(id))
  }
  const timeout = setTimeout(async () => {
    await fn()
    debounceTimers.delete(id)
  }, delay)

  debounceTimers.set(id, timeout)
}


export function clearDebounce(id) {
  if (debounceTimers.has(id)) {
    clearTimeout(debounceTimers.get(id))
    debounceTimers.delete(id)
  }
}

