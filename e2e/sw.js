// This will notify all clients about the incoming fetch event
// Understanding clients isn't relevant here, but if you're
// curious, you can check out the docs:
// https://developer.mozilla.org/en-US/docs/Web/API/Clients
const notifyClients = (event, requestBody) => {
  // there's probably no need to notify all clients, but this
  // does no harm to us in this testing scenario.
  clients.matchAll().then(cs => {
    cs.forEach(client => {
      client.postMessage({
        type: 'fetch',
        request: {
          url: event.request.url,
          body: requestBody
        }
      })
    })
  })
}

// self is the service-worker itself
// onfetch fires for every outgoing request from our domain
self.onfetch = function (event) {
  if (event.request.method === 'POST') {
    event.request.json().then(requestBody => {
      notifyClients(event, requestBody)
    }, err => {
      notifyClients(event)
    })
  } else {
    notifyClients(event)
  }
};