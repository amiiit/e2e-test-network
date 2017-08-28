const notifyClients = (event, requestBody) => {
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