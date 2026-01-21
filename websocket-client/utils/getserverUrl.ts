export const getServerUrl = () => {
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL 
  return `ws://${serverUrl}`
}
