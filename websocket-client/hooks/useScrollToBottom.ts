import { useEffect, RefObject, DependencyList } from 'react'

export const useScrollToBottom = (
  ref: RefObject<HTMLElement | null>,
  dependencies: DependencyList,
): void => {
  useEffect(() => {
    const container = ref.current?.parentElement
    if (container && container.classList.contains('overflow-y-auto')) {
      container.scrollTop = container.scrollHeight
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}
