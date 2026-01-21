const getAllMatchedSentences = (regex, buffer) => {
    const collectedMatches = [];
    let currentMatch;
    while ((currentMatch = regex.exec(buffer)) !== null) {
        collectedMatches.push(currentMatch);
    }
    return collectedMatches;
};
const extractSentencesAndLastIndex = (matches) => {
    const sentences = [];
    const lastProcessedIndex = matches.reduce((maxIndex, match) => {
        if (match[1]) {
            const completeSentence = match[1].trim();
            if (completeSentence) {
                sentences.push(completeSentence);
                return Math.max(maxIndex, match.index + match[0].length);
            }
        }
        return maxIndex;
    }, 0);
    return { sentences, lastProcessedIndex };
};
export const extractCompleteSentences = (buffer) => {
    // Match sentences ending with . ? ! followed by optional whitespace
    const sentenceRegex = /([^.!?]*[.!?])\s*/g;
    const regex = new RegExp(sentenceRegex);
    const allMatchedSentences = getAllMatchedSentences(regex, buffer);
    const { sentences, lastProcessedIndex } = extractSentencesAndLastIndex(allMatchedSentences);
    const remainingBuffer = lastProcessedIndex > 0
        ? buffer.substring(lastProcessedIndex).trimStart()
        : buffer;
    return {
        sentences,
        remainingBuffer,
    };
};
//# sourceMappingURL=sentenceUtils.js.map