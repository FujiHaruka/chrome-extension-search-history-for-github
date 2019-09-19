import { SuggestWithDefault } from './helpers/SuggestWithDefault'
import { historyItemsToSuggestions } from './helpers/historyItemsToSuggestions'
import { LazySearch } from './helpers/lazySearch'

const {
  onInputStarted,
  onInputChanged,
  onInputEntered,
  onInputCancelled,
} = chrome.omnibox

const lazySearch = new LazySearch()

onInputStarted.addListener(() => {})
onInputChanged.addListener((text, suggest) => {
  lazySearch.searchRequest(
    {
      text: 'github.com ' + text,
      startTime: new Date().getTime() - 1000 * 60 * 60 * 24 * 365,
      maxResults: 20,
    },
    (historyItems) => {
      const suggestions = historyItemsToSuggestions(historyItems)
      const suggestWithDefault = SuggestWithDefault(suggest)
      suggestWithDefault(suggestions)
    },
  )
})
onInputEntered.addListener(() => {})
onInputCancelled.addListener(() => {
  // resetDefaultSuggestion()
})
