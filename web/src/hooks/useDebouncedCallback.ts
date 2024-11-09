import { useEffect, useRef } from "react";

export function useDebouncedCallback<T>(
  callback: () => void,
  dependencies: T[],
  timeout: number
) {
  const timer = useRef<number>()

  useEffect(() => {
    clearTimeout(timer.current)
    timer.current = setTimeout(callback, timeout)
    return () => {
      clearTimeout(timer.current)
    }
  }, dependencies)
}
