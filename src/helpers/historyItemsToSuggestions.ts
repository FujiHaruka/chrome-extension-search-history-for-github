import uniqBy from 'lodash.uniqby'

interface StrictHistoryItem extends chrome.history.HistoryItem {
  url: string
  title: string
}

type SuggestResult = chrome.omnibox.SuggestResult

const isGitHub = (
  item: chrome.history.HistoryItem,
): item is StrictHistoryItem =>
  Boolean(
    item.url &&
      item.title &&
      new URL(item.url).pathname.length > 1 &&
      new URL(item.url).hostname === 'github.com',
  )

const toSuggestion = (item: { url: string; title: string }): SuggestResult => {
  const pathname = new URL(item.url).pathname.slice(1) // Remove first '/'
  return {
    content: pathname,
    description: `<url>${pathname}</url> <dim>${item.title}</dim>`,
  }
}

const Actions = ['_new', '_edit', 'new']

const ignoreAction = (suggestions: SuggestResult) => {
  const lastPath = suggestions.content.split('/').pop() || ''
  return !Actions.includes(lastPath)
}

const uniqByContent = (suggestions: SuggestResult[]) =>
  uniqBy(suggestions, 'content')

const compareByDepth = (a: SuggestResult, b: SuggestResult) =>
  a.content.split('/').length - b.content.split('/').length

export const historyItemsToSuggestions = (
  items: chrome.history.HistoryItem[],
): SuggestResult[] =>
  uniqByContent(
    items
      .filter(isGitHub)
      .map(toSuggestion)
      .filter(ignoreAction),
  )
    .sort(compareByDepth)
    .slice(0, 6)
