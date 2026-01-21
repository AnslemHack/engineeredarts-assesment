export const calculateReconnectDelay = (
  attempt: number,
  initialDelay: number = 1000,
  maxDelay: number = 30000,
): number => {
  const delay = Math.min(initialDelay * Math.pow(2, attempt), maxDelay)
  return delay
}
