import NetworkTestUtils from './NetworkTestUtils'

var chai = require('chai');
var expect = chai.expect;
let networkUtils

describe('Tracking Service Worker', function () {

  beforeEach(() => {
  })

  beforeAll(() => {
    networkUtils = new NetworkTestUtils({browser})
    browser.url('/')
  })

  it('Test the price is displayed', () => {
    browser.url('/')
    browser.waitUntil(() => {
      const text = browser.getText('#europrice')
      let isNumeric = false
      try {
        isNumeric = !isNaN(parseFloat(text))
      } catch (e) {
      }
      console.log('isNumeric',isNumeric)
      return isNumeric
    }, 50000)
  })

  it('The bitcoin API should be called exactly once', () => {
    browser.waitUntil(() => {
      const requests = networkUtils.getRequestsStarting('https://api.coindesk.com')
      return requests.length === 1
    })
  })

})
