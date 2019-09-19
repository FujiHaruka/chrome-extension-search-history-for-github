export class LazySearch {
  requested = false
  lastRequested = new Date()
  timer = -1
  delay = 300

  searchRequest(
    query: chrome.history.HistoryQuery,
    callback: (results: chrome.history.HistoryItem[]) => void,
  ) {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      console.log('Search history:', query.text)
      chrome.history.search(query, (results) => {
        console.log(`Found ${results.length} items for query "${query.text}"`)
        callback(results)
      })
    }, this.delay) as any
  }
}
