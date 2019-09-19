export class SuggestionStore {
  currentSuggestions: chrome.omnibox.SuggestResult[] = []

  suggestWithDefault(
    suggestCallback: (suggestions: chrome.omnibox.SuggestResult[]) => void,
    suggestions: chrome.omnibox.SuggestResult[],
  ) {
    this.currentSuggestions = suggestions
    if (suggestions.length === 0) {
      chrome.omnibox.setDefaultSuggestion({
        description: '<dim>no matching results with</dim>',
      })
      suggestCallback([])
      return
    }
    chrome.omnibox.setDefaultSuggestion({
      description: suggestions[0].description,
    })
    suggestCallback(suggestions.slice(1))
  }

  matchCurrentSuggestion(text: string) {
    const { currentSuggestions } = this
    if (currentSuggestions.length === 0) {
      return null
    }
    // content との一致を探して見つからなければ defaultSuggestion である
    const suggestion =
      currentSuggestions.find(({ content }) => content === text) ||
      currentSuggestions[0]
    return suggestion
  }
}
