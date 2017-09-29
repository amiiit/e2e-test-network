export default class NetworkTestUtils {

  constructor({browser}) {
    this.lastSwitchedFrame = null
    this.browser = browser
  }

  switchFrame = (id) => {
    console.log('SwitchFrame', id, typeof id)
    this.lastSwitchedFrame = id
    this.browser.frame(id)
  }

  isParentFrame = () => {
    const requests = this.browser.execute(function () {
      return window.__e2eFetchRequests
    }).value
    return requests !== null
  }

  resetRequestsOnClient = () => {
    const isParent = this.isParentFrame()
    if (!isParent) {
      this.browser.frameParent()
    }
    this.browser.execute(function () {
      return window.__e2eFetchRequests = []
    })
    if (!isParent && this.lastSwitchedFrame !== null) {
      this.browser.frame(this.lastSwitchedFrame)
    }
  }

  getClientRequestsFromCurrentFrame = (containing) => {
    let execution = this.browser.execute(function () {
      return window.__e2eFetchRequests
    })

    let requests = execution.value

    if (!requests) {
      console.log('Execution script returned null', execution)
    }

    if (containing && requests) {
      requests = requests.map(r => r.request).filter(request => request.url.indexOf(containing) > -1)
    }
    return requests
  }

  getClientRequests = () => {
    let requests = this.getClientRequestsFromCurrentFrame()

    if (!requests) {
      this.browser.frameParent()
      requests = this.getClientRequestsFromCurrentFrame()
      this.lastSwitchedFrame !== null && this.browser.frame(this.lastSwitchedFrame)
    }
    return requests && requests.map(r => r.request) || []
  }

  getRequestsContaining = (urlPart) => {
    const requests = this.getClientRequests()
    return requests && requests.filter(request => request.url.indexOf(urlPart) > -1)
  }

  getRequestsStarting = (urlStart) => {
    const requests = this.getClientRequests()
    const filteredRequests = requests && requests.filter(request => {
      return request.url.indexOf(urlStart) === 0
    })
    return filteredRequests
  }

  isRequstUrlContainingParam(request, param) {
    return request.url.split('?')[1].split('&').map(kv => ({
      key: kv.split('=')[0], value: kv.split('=')[1]
    })).filter(entry => entry.key === param).length > 0
  }

  paramsCount = (request) => {
    return request.url.split('?')[1].split('&').length
  }
}