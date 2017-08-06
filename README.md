# Use a Service Worker for your e2e testing

##Test network activity using ServiceWorker and Selenium.
Bugs in network activity are hard to find before its too late. 
Here I'm about to share with you a non intrusive method for asserting
on network request natively in the browser using Selenium and Service-Workers.

##An example test
```
describe('Tracking requests', () => {
  it('Ad view tracking', () => {
    browser.url('/')
    browser.waitUntil(() => {
      const recordedRequests = this.browser.execute(() => {
        return window.__e2eFetchRequests
      }).value

      const trackingRequests = recordedRequests.map(request => {
        return request.url.indexOf('https://mytrackingservice.com/my/tracking/request')
      })
      return trackingRequests && trackingRequests.length === 1
    }, 2000, 'Must send tracking request', 200)
  })
})
```

