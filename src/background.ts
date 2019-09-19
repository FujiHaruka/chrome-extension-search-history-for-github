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
const suggestWithDefault = new SuggestWithDefault()

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
      suggestWithDefault.doSuggest(suggest, suggestions)
    },
  )
})
onInputEntered.addListener((text, disposition) => {
  const suggestion = suggestWithDefault.matchCurrentSuggestion(text)
  if (suggestion) {
    chrome.tabs.create({
      url: 'https://github.com/' + suggestion.content,
    })
  }
})

onInputCancelled.addListener(() => {
  suggestWithDefault.currentSuggestions = []
})
