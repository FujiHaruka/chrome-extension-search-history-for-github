import uniqBy from 'lodash.uniqby'

interface StrictHistoryItem extends chrome.history.HistoryItem {
  url: string
  title: string
}

const isGitHub = (
  item: chrome.history.HistoryItem,
): item is StrictHistoryItem =>
  Boolean(
    item.url &&
      item.title &&
      new URL(item.url).pathname.length > 1 &&
      new URL(item.url).hostname === 'github.com',
  )

const toSuggestion = (item: {
  url: string
  title: string
}): chrome.omnibox.SuggestResult => {
  const pathname = new URL(item.url).pathname.slice(1) // Remove first '/'
  return {
    content: pathname,
    description: `<url>${pathname}</url> <dim>${item.title}</dim>`,
  }
}

const uniqByContent = (suggestions: chrome.omnibox.SuggestResult[]) =>
  uniqBy(suggestions, 'content')

export const historyItemsToSuggestions = (
  items: chrome.history.HistoryItem[],
): chrome.omnibox.SuggestResult[] =>
  uniqByContent(items.filter(isGitHub).map(toSuggestion))
