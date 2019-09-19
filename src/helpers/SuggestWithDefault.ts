export const SuggestWithDefault = (
  suggest: (suggestions: chrome.omnibox.SuggestResult[]) => void,
) => (suggestions: chrome.omnibox.SuggestResult[]) => {
  if (suggestions.length === 0) {
    return
  }
  chrome.omnibox.setDefaultSuggestion({
    description: suggestions[0].description,
  })
  suggest(suggestions.slice(1))
}
