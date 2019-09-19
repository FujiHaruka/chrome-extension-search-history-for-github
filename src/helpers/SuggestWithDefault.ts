export class SuggestWithDefault {
  currentSuggestions: chrome.omnibox.SuggestResult[] = []

  doSuggest(
    suggest: (suggestions: chrome.omnibox.SuggestResult[]) => void,
    suggestions: chrome.omnibox.SuggestResult[],
  ) {
    this.currentSuggestions = suggestions
    if (suggestions.length === 0) {
      chrome.omnibox.setDefaultSuggestion({
        description: '<dim>no matching results with</dim>',
      })
      suggest([])
      return
    }
    chrome.omnibox.setDefaultSuggestion({
      description: suggestions[0].description,
    })
    suggest(suggestions.slice(1))
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
