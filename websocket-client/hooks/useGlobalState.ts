import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'

export function useGlobalState<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void] {
  const queryClient = useQueryClient()

  const { data } = useQuery<T>({
    queryKey: [key],
    queryFn: () => {
      const cached = queryClient.getQueryData<T>([key])
      return cached ?? initialValue
    },
    initialData: initialValue,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      queryClient.setQueryData<T>([key], (prev: T | undefined) => {
        const currentValue = prev ?? initialValue
        return typeof value === 'function'
          ? (value as (prev: T) => T)(currentValue)
          : value
      })
    },
    [queryClient, initialValue, key],
  )

  return [data ?? initialValue, setValue]
}
