import { SuggestionStore } from './helpers/SuggestionStore'
import { historyItemsToSuggestions } from './helpers/historyItemsToSuggestions'
import { LazySearch } from './helpers/lazySearch'

const { onInputStarted, onInputChanged, onInputEntered } = chrome.omnibox

const lazySearch = new LazySearch()
const suggestionsStore = new SuggestionStore()

onInputStarted.addListener(() => {
  suggestionsStore.currentSuggestions = []
})

onInputChanged.addListener((text, suggest) => {
  lazySearch.searchRequest(
    {
      text: 'github.com ' + text,
      startTime: new Date().getTime() - 1000 * 60 * 60 * 24 * 365,
      maxResults: 20,
    },
    (historyItems) => {
      const suggestions = historyItemsToSuggestions(historyItems)
        .sort((a, b) => a.content.length - b.content.length)
        .slice(0, 6)
      suggestionsStore.suggestWithDefault(suggest, suggestions)
    },
  )
})

onInputEntered.addListener((text, disposition) => {
  const suggestion = suggestionsStore.matchCurrentSuggestion(text)
  if (suggestion) {
    chrome.tabs.create({
      url: 'https://github.com/' + suggestion.content,
    })
  }
})
