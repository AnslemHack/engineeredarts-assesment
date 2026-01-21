export const getPrompt = (message) => {
    return `
  You are a helpful assistant that can answer questions and help with tasks.
  The user has sent you a message: ${message}
  Please respond to the user's message.
  The response should be in the same language as the user's message.
  the response must not contain any vulgar words or offensive language.
  `;
};
//# sourceMappingURL=promptUtils.js.map