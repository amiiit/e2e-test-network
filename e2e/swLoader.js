import swURL from 'file-loader?name=/sw.js!babel-loader!./sw'

window.__e2eFetchRequests = []

try {
  navigator.serviceWorker
    .register(swURL, { scope: '/' })
    .then(registration => {
      console.info('e2e service worker is running')

      navigator.serviceWorker.ready.then(serviceWorkerRegistration => {
        if (!navigator.serviceWorker.controller) {
          console.info(
            'Will reload now in order to have a service-worker controller',
          )
          window.location.reload()
        }
        navigator.serviceWorker.addEventListener('message', function(event) {
          window.__e2eFetchRequests.push(event.data)
        })
      })
    })
    .catch(err => {
      console.warn('service worker failed', err)
    })
} catch (e) {
  console.log('Error setting up service worker', e)
}
